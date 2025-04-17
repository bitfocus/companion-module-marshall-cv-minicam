import {
	TCPHelper,
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
} from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	connection!: TCPHelper
	state!: {
		osdVisible: boolean
	}

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.state = {
			osdVisible: false,
		}

		this.connect()
		this.updateStatus(InstanceStatus.Ok)

		await this.queryState()

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	connect(): void {
		this.updateStatus(InstanceStatus.Connecting)
		this.connection = new TCPHelper(this.config.host, this.config.port)
		this.connection.on('status_change', (state, message) => {
			this.updateStatus(state, message)
			this.log('debug', 'Socket reconnected')
		})
		this.connection.on('connect', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', 'Socket connected')
		})
		this.connection.on('error', () => {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Connection error')
			this.log('debug', 'Socket connect error')
		})
		this.connection.on('end', () => {
			this.updateStatus(InstanceStatus.Disconnected, 'Disconnecting')
			this.log('debug', 'Socket Disconnecting')
			this.connection?.destroy()
		})
		this.connection.on('data', (msg_data) => {
			const messages: Uint8Array[] = []
			let index = 0
			while (index < msg_data.length) {
				const message = []
				let char = msg_data.readUInt8(index)
				while (char !== 0xff) {
					message.push(char)
					char = msg_data.readUInt8(++index)
				}
				message.push(0xff)
				messages.push(Uint8Array.from(message))
				index++
			}
			for (const msg of messages) {
				let hexStr = ''
				msg.forEach((item) => (hexStr += parseInt(String(item), 10).toString(16).padStart(2, '0').toUpperCase()))
				if (hexStr === '9041FF') {
					console.log('[OK]')
				} else if (hexStr === '9051FF') {
					console.log('[COMPLETED]')
				} else if (hexStr === '905002FF') {
					console.log('MENU OPEN')
					this.state.osdVisible = true
				} else if (hexStr === '905003FF') {
					console.log('MENU CLOSED')
					this.state.osdVisible = false
				} else {
					console.log('UNKOWN RESPONSE', hexStr)
				}
			}

			this.checkFeedbacks()
		})
	}

	async queryState(): Promise<void> {
		await this.connection.send(Buffer.from('81090606FF', 'hex')) // Menu mode query
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)

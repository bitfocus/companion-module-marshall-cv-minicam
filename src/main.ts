import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { MarshallCV5xx } from './masrshall-api.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	camera!: MarshallCV5xx
	messages: Uint8Array[] = []

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.camera = new MarshallCV5xx(Number(config.camID))

		this.camera.on('connected', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', 'Socket connected')
		})
		this.camera.on('error', () => {
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Connection error')
			this.log('debug', 'Socket connect error')
		})
		this.camera.on('disconnected', () => {
			this.updateStatus(InstanceStatus.Disconnected, 'Disconnecting')
			this.log('debug', 'Socket Disconnecting')
		})
		this.camera.on('stateChanged', () => {
			this.checkFeedbacks()
		})
		this.camera.connect(config.host, config.port)

		this.updateStatus(InstanceStatus.Ok)
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets()
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

	updatePresets(): void {
		UpdatePresets(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)

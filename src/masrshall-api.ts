import { viscaCommands, viscaInquiryCommands } from './commands.js'
import { TCPHelper } from '@companion-module/base'
import { EventEmitter } from 'eventemitter3'

export enum OSDMenuNav {
	'show',
	'hide',
	'toggle',
	'ok',
	'down',
	'up',
	'left',
	'right',
}

export enum WBMode {
	'atw',
	'indoor',
	'outdoor',
	'one_push',
	'manual',
}

export type MarshallCV5xxState = {
	osdVisible: boolean
	wb: {
		mode: WBMode
	}
}

type MarshallCV5xxEvents = {
	stateChanged: []
	disconnected: []
	connected: []
	error: [string]
}

interface SentPackets {
	ackReceived: boolean
	resolve: (data: Uint8Array) => void
	reject: (err: string) => void
}

export class MarshallCV5xx extends EventEmitter<MarshallCV5xxEvents> {
	#connection!: TCPHelper
	#messages: Uint8Array[] = []
	#host: string = '127.0.0.1'
	#port: number = 5678
	#camID: number = 1
	#sentQueue: (SentPackets | undefined)[] = []
	#state: MarshallCV5xxState = {
		osdVisible: false,
		wb: {
			mode: WBMode.atw,
		},
	}

	constructor(camID: number) {
		super()
		this.#camID = camID
	}

	connect(host: string, port: number): void {
		this.#host = host
		this.#port = port
		this.#connection = new TCPHelper(this.#host, this.#port)
		this.#connection.on('connect', () => {
			this.emit('connected')
		})
		this.#connection.on('error', (error) => {
			this.emit('error', error.message)
		})
		this.#connection.on('end', () => {
			this.emit('disconnected')
			this.#connection?.destroy()
		})

		this.#connection.on('data', (msg_data) => {
			let index = 0
			while (index < msg_data.length) {
				const message = []
				let char = msg_data.readUInt8(index)
				while (char !== 0xff) {
					message.push(char)
					char = msg_data.readUInt8(++index)
				}
				message.push(0xff)
				this.#messages.push(Uint8Array.from(message))
				index++
			}

			for (const msg of this.#messages) {
				let hexStr = ''
				msg.forEach((item) => (hexStr += parseInt(String(item), 10).toString(16).padStart(2, '0').toUpperCase()))
				if (hexStr === '9041FF') {
					console.log('[OK]')
					if (this.#sentQueue[0]) this.#sentQueue[0].ackReceived = true
				} else if (hexStr === '9051FF') {
					console.log('[COMPLETED]')
					const sent = this.#sentQueue.shift()
					if (sent && sent.ackReceived) {
						sent.resolve(msg)
					} else if (sent) {
						sent.reject('No ACK received')
					}
				} else {
					const sent = this.#sentQueue.shift()
					if (sent) {
						console.log('Message is ', msg)
						sent.resolve(msg)
					} else {
						console.log('UNKOWN RESPONSE', hexStr)
					}
				}
			}
			this.#messages = []
		})
	}

	async #sendMessage(cmd: string): Promise<Uint8Array> {
		await this.#connection.send(Buffer.from(cmd.replace('x', String(this.#camID)), 'hex'))
		return new Promise<Uint8Array>((resolve, reject) => {
			this.#sentQueue.push({ ackReceived: false, resolve, reject })
		})
	}

	state(): MarshallCV5xxState {
		return this.#state
	}

	async setWBMode(mode: WBMode): Promise<void> {
		this.#sendMessage((viscaCommands.wb.mode as any)[mode]).then(
			(_data) => {
				this.#sendMessage(viscaInquiryCommands.CAM_WBModeInq).then(
					(data) => {
						// Response format
						// Y0 50 0X FF
						// Y = 0xZ0  + 0x80
						// Z = camera id
						// X = set whitebalace
						const header1 = 0x80 + (this.#camID << 4)
						const msgId = 0x50
						if (data[0] !== header1 || data[1] !== msgId) {
							console.log('ERROR IN INQ RESP')
							return // Error!! Handle this
						}
						this.#state.wb.mode = data[2]
						this.emit('stateChanged')
					},
					() => {
						console.log('Error querying WB state')
					},
				)
			},
			() => {
				console.log('Error changing WB')
			},
		)
	}

	async osdMenu(cmd: OSDMenuNav): Promise<void> {
		if (cmd === OSDMenuNav.show) {
			await this.#sendMessage(viscaCommands.osd.open_menu)
		} else if (cmd === OSDMenuNav.hide) {
			await this.#sendMessage(viscaCommands.osd.exit_menu)
		} else if (cmd === OSDMenuNav.toggle) {
			await this.#sendMessage(viscaCommands.osd.toggle_menu)
		} else if (cmd === OSDMenuNav.ok) {
			await this.#sendMessage(viscaCommands.osd.menu_ok)
		} else if (cmd === OSDMenuNav.down) {
			await this.#sendMessage(viscaCommands.osd.nav_down)
		} else if (cmd === OSDMenuNav.up) {
			await this.#sendMessage(viscaCommands.osd.nav_up)
		} else if (cmd === OSDMenuNav.left) {
			await this.#sendMessage(viscaCommands.osd.nav_left)
		} else if (cmd === OSDMenuNav.right) {
			await this.#sendMessage(viscaCommands.osd.nav_right)
		}
		this.#sendMessage(viscaInquiryCommands.SYS_MenuModeInq).then(
			(data) => {
				// Response format
				// Y0 50 0X FF
				// Y = 0xZ0  + 0x80
				// Z = camera id
				// X = 2 == open, 3 == close
				const header1 = 0x80 + (this.#camID << 4)
				const msgId = 0x50
				if (data[0] !== header1 || data[1] !== msgId) {
					console.log('ERROR IN INQ RESP')
					return // Error!! Handle this
				}
				this.#state.osdVisible = data[2] === 2
				this.emit('stateChanged')
			},
			() => {
				console.log('Error querying OSD menu state')
			},
		)
	}
}

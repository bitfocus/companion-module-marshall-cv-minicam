import { viscaCommands, viscaInquiryCommands, viscaResponseCommands } from './commands.js'
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

export enum WBGainAdjustChannel {
	'red',
	'blue',
}

export enum WBGainAdjust {
	'rest',
	'up',
	'down',
	'direct',
}

export type MarshallCV5xxState = {
	osdVisible: boolean
	wb: {
		mode: WBMode
		gain: {
			red: number
			blue: number
		}
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
			gain: {
				red: 0,
				blue: 0,
			},
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
					if (this.#sentQueue[0]) this.#sentQueue[0].ackReceived = true
				} else if (hexStr === '9051FF') {
					const sent = this.#sentQueue.shift()
					if (sent && sent.ackReceived) {
						sent.resolve(msg)
					} else if (sent) {
						sent.reject('No ACK received')
					}
				} else {
					const sent = this.#sentQueue.shift()
					if (sent) {
						sent.resolve(msg)
					} else {
						console.log('UNKOWN RESPONSE', hexStr)
					}
				}
			}
			this.#messages = []
		})
	}

	async #sendMessage(cmd: string, para: { [key: string]: number } = { x: this.#camID }): Promise<Uint8Array> {
		//await this.#connection.send(Buffer.from(cmd.replace('x', String(this.#camID)), 'hex'))
		let parsedCmd = cmd
		for (const p in para) {
			parsedCmd = parsedCmd.replace(p, para[p].toString(16))
		}
		await this.#connection.send(Buffer.from(parsedCmd, 'hex'))
		return new Promise<Uint8Array>((resolve, reject) => {
			this.#sentQueue.push({ ackReceived: false, resolve, reject })
		})
	}

	#decodePacket(pkt: Uint8Array, hint?: viscaResponseCommands): { [key: string]: number } {
		const ret: { [key: string]: number } = {}
		const hintBytes = hint!.split(/(?=(?:..)*$)/)
		for (const [i, value] of hintBytes.entries()) {
			const intVal = parseInt(value, 16)
			if (!intVal) {
				if (value[0] === value[1]) {
					// case pp
					ret[value[0]] = pkt[i]
				} else if (isNaN(parseInt(value[0], 16))) {
					// case p0
					ret[value[0]] = (pkt[i] >> 4) & 0xf
				} else if (isNaN(parseInt(value[1], 16))) {
					// case 0p
					ret[value[1]] = pkt[i] & 0xf
				}
			} else {
				if (intVal !== pkt[i]) {
					console.log('Error is resp: byte', i, 'does not match. Want', hint![i], 'found', pkt[i])
				}
			}
		}
		const recvCamID = ret.y ^ 0x8
		if (recvCamID !== this.#camID) {
			console.log('Error in resp: camID does not match. Want', this.#camID, 'found', ret.y)
		}
		return ret
	}

	state(): MarshallCV5xxState {
		return this.#state
	}

	async setWBMode(mode: WBMode): Promise<void> {
		const mode_str: WBMode = Object.values(WBMode)[Number(mode)] as WBMode

		this.#sendMessage((viscaCommands.wb.mode as any)[mode_str]).then(
			(_data) => {
				this.#sendMessage(viscaInquiryCommands.CAM_WBModeInq).then(
					(data) => {
						//
						// A bug in marshall visca , if WB is set to manual
						// an inquiry will return AWB beeing set
						//
						const para = this.#decodePacket(data, viscaResponseCommands.FourByteOneParaValue)
						this.#state.wb.mode = para.x as WBMode
						this.emit('stateChanged')
					},
					() => {
						console.log('Error querying WB state')
					},
				)
			},
			() => {
				console.log('Error changing WB to mode', mode_str)
			},
		)
	}

	// value 0-255
	async WBGainAdjust(channel: WBGainAdjustChannel, fun: WBGainAdjust, value?: number): Promise<void> {
		const ch_str = Object.values(WBGainAdjustChannel)[Number(channel)] as WBGainAdjustChannel
		const fun_str = Object.values(WBGainAdjust)[Number(fun)] as WBGainAdjust
		const cmd = (viscaCommands.wb.gain as any)[ch_str][fun_str]
		const para = {
			x: this.#camID,
			p: 0,
			q: 0,
		}

		if (value !== undefined && fun === WBGainAdjust.direct) {
			para['p'] = (value >> 4) & 0xf
			para['q'] = value & 0xf
		}
		this.#sendMessage(cmd, para).then(
			(_data) => {
				const msg =
					channel === WBGainAdjustChannel.blue ? viscaInquiryCommands.CAM_BGainInq : viscaInquiryCommands.CAM_RGainInq
				this.#sendMessage(msg).then(
					(data) => {
						const recvPara = this.#decodePacket(data, viscaResponseCommands.SevenByteTwoParaValues)
						const recvGain = ((recvPara.p & 0xf) << 4) | (recvPara.q & 0xf)
						if (channel === WBGainAdjustChannel.blue) this.#state.wb.gain.blue = recvGain
						else if (channel === WBGainAdjustChannel.red) this.#state.wb.gain.red = recvGain
						else console.log('Error: unknown color channel')
						this.emit('stateChanged')
					},
					() => {
						console.log('Error querying WB gain')
					},
				)
			},
			() => {
				console.log('Error adjusting WB gain')
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
				const para = this.#decodePacket(data, viscaResponseCommands.FourByteOneParaValue)
				this.#state.osdVisible = para.x === 2
				this.emit('stateChanged')
			},
			() => {
				console.log('Error querying OSD menu state')
			},
		)
	}
}

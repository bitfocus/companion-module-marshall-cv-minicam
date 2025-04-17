import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		osd_open_menu: {
			name: 'OSD: open menu',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060602FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_close_menu: {
			name: 'OSD: save & close menu',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060603FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_back: {
			name: 'OSD: menu toggle',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060610FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_ok: {
			name: 'OSD: menu ok',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('81017E01020001FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_down: {
			name: 'OSD: menu step down',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060101010302FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_up: {
			name: 'OSD: menu step up',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060101010301FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_left: {
			name: 'OSD: menu step left',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060101010103FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
		osd_right: {
			name: 'OSD: menu step right',
			options: [],
			callback: async (_event) => {
				const buffer = Buffer.from('8101060101010203FF', 'hex')
				await self.connection.send(buffer)
				await self.queryState()
			},
		},
	})
}

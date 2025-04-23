import type { ModuleInstance } from './main.js'
import { OSDMenuNav, WBMode } from './masrshall-api.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		osd_open_menu: {
			name: 'OSD: open menu',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.show)
			},
		},
		osd_exit_menu: {
			name: 'OSD: exit menu',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.hide)
			},
		},
		osd_back: {
			name: 'OSD: menu toggle',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.toggle)
			},
		},
		osd_ok: {
			name: 'OSD: menu ok',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.ok)
			},
		},
		osd_navigate_down: {
			name: 'OSD: menu navigate down',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.down)
			},
		},
		osd_navigate_up: {
			name: 'OSD: menu navigate up',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.up)
			},
		},
		osd_navigate_left: {
			name: 'OSD: menu navigate left',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.left)
			},
		},
		osd_navigate_right: {
			name: 'OSD: menu navigate right',
			options: [],
			callback: async (_event) => {
				await self.camera.osdMenu(OSDMenuNav.right)
			},
		},
		wb_set_mode: {
			name: 'Whitebalance: set mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode:',
					id: 'wb_mode_id',
					choices: [
						{ id: WBMode.atw, label: 'auto' },
						{ id: WBMode.indoor, label: 'indoor' },
						{ id: WBMode.outdoor, label: 'outdoor' },
						{ id: WBMode.one_push, label: 'one push' },
						{ id: WBMode.manual, label: 'manual' },
					],
					default: WBMode.atw,
				},
			],
			callback: async (event) => {
				const reqMode: WBMode = Object.values(WBMode)[Number(event.options['wb_mode_id'])] as WBMode
				await self.camera.setWBMode(reqMode)
			},
		},
	})
}

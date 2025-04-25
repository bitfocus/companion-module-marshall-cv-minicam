import type { ModuleInstance } from './main.js'
import { OSDMenuNav, WBMode, WBGainAdjust, WBGainAdjustChannel } from './masrshall-api.js'

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
				await self.camera.setWBMode(event.options['wb_mode_id'] as WBMode)
			},
		},
		wb_red_gain: {
			name: 'Whitebalance: adjust color channel gain',
			options: [
				{
					type: 'dropdown',
					label: 'Color channel:',
					id: 'wb_gain_channel_id',
					choices: [
						{ id: WBGainAdjustChannel.red, label: 'red' },
						{ id: WBGainAdjustChannel.blue, label: 'blue' },
					],
					default: WBGainAdjustChannel.red,
				},
				{
					type: 'dropdown',
					label: 'Adjustment:',
					id: 'wb_gain_adjustment_id',
					choices: [
						{ id: WBGainAdjust.rest, label: 'reset' },
						{ id: WBGainAdjust.up, label: 'up' },
						{ id: WBGainAdjust.down, label: 'down' },
						{ id: WBGainAdjust.direct, label: 'direct' },
					],
					default: WBGainAdjust.rest,
				},
				{
					type: 'number',
					label: 'Gain',
					id: 'wb_gain_direct_id',
					min: 0,
					max: 255,
					step: 1,
					default: 128,
					range: true,
					isVisible: (options) => options.wb_tone_adjustment_id === 3,
				},
			],
			callback: async (event) => {
				const channel = event.options.wb_gain_channel_id as WBGainAdjustChannel
				const fun = event.options.wb_gain_adjustment_id as WBGainAdjust
				if (fun === WBGainAdjust.direct) {
					await self.camera.WBGainAdjust(channel, fun, Number(event.options.wb_gain_direct_id))
				} else {
					await self.camera.WBGainAdjust(channel, fun)
				}
			},
		},
	})
}

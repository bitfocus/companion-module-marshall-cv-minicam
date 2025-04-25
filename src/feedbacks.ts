import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { WBMode, WBGainAdjustChannel } from './masrshall-api.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		osd_visible_feedback: {
			name: 'OSD visible',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (_feedback) => {
				return self.camera.state().osdVisible
			},
		},
		wb_selected_feedback: {
			name: 'WB mode',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
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
					default: 'auto',
				},
			],
			callback: (feedback) => {
				return self.camera.state().wb.mode === feedback.options['wb_mode_id']
			},
		},
		wb_channel_gain_feedback: {
			name: 'WB channel gain',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel:',
					id: 'wb_gain_channel_id',
					choices: [
						{ id: WBGainAdjustChannel.red, label: 'red' },
						{ id: WBGainAdjustChannel.blue, label: 'blue' },
					],
					default: WBGainAdjustChannel.red,
				},
				{
					type: 'number',
					label: 'Gain',
					id: 'wb_gain_value_id',
					min: 0,
					max: 255,
					step: 1,
					default: 128,
					range: true,
				},
			],
			callback: (feedback) => {
				const ch_str = Object.values(WBGainAdjustChannel)[
					Number(feedback.options.wb_gain_channel_id)
				] as WBGainAdjustChannel
				return feedback.options.wb_gain_value_id === (self.camera.state().wb as any).gain[ch_str]
			},
		},
	})
}

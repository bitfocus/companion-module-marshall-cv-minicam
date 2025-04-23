import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { WBMode } from './masrshall-api.js'

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
	})
}

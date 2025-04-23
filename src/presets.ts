/*
Arrow icons from
<a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by tenBystry - Flaticon</a>

OK and Archive icon from
<a href="https://www.flaticon.com/free-icons/good" title="good icons">Good icons created by sonnycandra - Flaticon</a>
*/
import { CompanionPresetDefinitions } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	presets[`osd_navigate_up`] = {
		type: 'button',
		category: 'OSD',
		name: 'navigate up',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAHYAAAB2AH6XKZyAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABcpJREFUeJztmXtMU1ccx0+L4mtBnRoFdYmbccliFp+D7A/n1rkpyeJc4Ko8iohLmMjDYdW5mdz9MTMhPCoocSZj8sdIauaSmbklCzrjNFEeSltAmcXeQpDWtrS30PbePn7747QrpS3lFlpSvZ+EnPaG8/h+z6Pn2yLEw8PDw8PDw8PDw8PD8/IhmIlO6+ourdGZ9cctlpH1CACSFiYplyUtqSwu/vxprMcSUwNIkhSOOODa0JDu4/SdOxLeXPsGQgihx09U6Pqff7mSk5f/sWAW2k2SpDuW44oJpEyWeKioTPVDYxO43W4Yj9vthos/XoZDRWUqUiZLnOnxTite8T/LfgkQPp4rv/4G+YUlVGNj49yZHve0wEX8C2dCJOJfGBOmIj7uTZgO8XFrwnSKjzsTOIl3uwH0zwBYO4BJH/8mcJ55bT8AYwN4PghgMQOYjfFrAmfxQxoAlwubYLcBGLUAtAkbEW8mRCTeWzodeAVYR/A2MOnx63gxYUri3W7PNrADGLQAFs8KMGjxsxiZIJyKeM3NOz2i7dte35/5WfgK2n6Elq/2lboBpLG6kOZRN0LzFiDkciLkcuDXtBG/n4CMTz9BH4m2v3anTf7o3PXrcyLVERGkTJZYcLi0r/nKVe4z7ykpSgNEVi6bmZPPUIqHePbHrgBtP14lYWi+chUKDpf2RRqgOK8AUiZLHLh1t0e0fduafRl7wlcYP/PafkSxAiQ5ecqZmpq6K23rlvePfV/D9vX1+a+AJSsQ0g2EbX5fxh60c4doDXXjn3+jfiZw/pzX9uPT3rvnhzSgpjRA7M9xVEnrRd52q6Tn383MymNUCjleAXZbYN0wRP1g5CTe6cSnO+MR4nQAaPtB/VQNRFYuO1a8vwliRtWlDFoXnI6ZM4GTeAcLYNQBjNL4pmfHlx21SgVEljio+AATupV+dYGx+8pYm8BZvNmALzVGHcCIGcCoBXVvb1jxASZ0KfAFyToSWMbKBM7iaSO+0poNuDTpQd3TDUR23qTEB5igkOO2LObAMtomRDbzRo8J2AB1l5yzeH8T8hhV5wMs2KT3lbQJ9xEtEzgfeEadb1CeLaBWdAKRcyAi8X4mZOcxqoftgVthhI5OiuR0yfFG2lEzNsE8DGAeBsojvubchQ8jFe8zoV6UmZPPUJ0dvsPQbvP1OwkTOF2WistP3m9qloUXDxAYaYf1QCnlQGQfYGtr63dMVXyACQ9afR+LHKN0U7MMisu/ujdhRxW1dXuPnvgm/K0DIGikpSI48DiZkHuQoTruRxylSySn3BW1dZkhO/miTKJQdj+anHhv6Ym0VG9v1MR7OVNR/V5G7kE71XE/oigtV3bB4aPH5SE7IMQFdLBfbUKK91x3qUlccqaL/1fCg1bOUdrlcgEhLqDHtucXhhKECbMEggl+LgwRaSWnv3Wkpr6zq7z0SEt0ZPsoLz3SkrZlU/qxqgss1ygtFAqRUChM8Hvm/x8Cm81mD95zkFSnYRCSfH06ZuK9lJceaUnbujn9WGUdq1E9QShhNv6zjSKU9CpChiGEAALqjVqtSCAQ2sY+8zNgVUry3Ru3bgf2GEz8mEgbS/FevCZIztY6NBrNpKJ0y9+30aqUlLshG61uaFi5V3yIpWkL3jQhIi0VJNLOFFXSehGRfYCleronjNI0bQFCXMDWXLyYPGGD31VUH80vLHYZdM+DxlKFQgHE/uCRdqaoktaLiKw8VtHWFnTMep0W8guLXWcqa8rG1w164p2tlua3t3ec37p507y0t9ahhStXo2dPHqOWdiXSDw4aNmzYuK2kpLA7+tImj7ShYX1n28Oby1YkL/1gy9soee06ZBqg0L3HT1F7a6t94+ZNhSe+LL08vl7II58kyVmzX1lcNDxsTGdYJmn+3PmDS5ct+UlSUnQtulKmRqW0frdebxRb7daUOYlz6EWLFv/uHDVdIEly4m9ZeXh4eHh4eHh4eHh4eF4i/gOXK17yTpuYSQAAAABJRU5ErkJggg==',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_navigate_up',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`osd_navigate_down`] = {
		type: 'button',
		category: 'OSD',
		name: 'navigate down',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'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',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_navigate_down',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`osd_navigate_left`] = {
		type: 'button',
		category: 'OSD',
		name: 'navigate left',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'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',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_navigate_left',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`osd_navigate_right`] = {
		type: 'button',
		category: 'OSD',
		name: 'navigate right',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'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',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_navigate_right',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`osd_exit_menu`] = {
		type: 'button',
		category: 'OSD',
		name: 'exit menu, a choice to save settings will be presented before exiting',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'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',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_exit_menu',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets[`osd_open_menu_or_ok`] = {
		type: 'button',
		category: 'OSD',
		name: 'short press: OK , long press: open OSD menu',
		style: {
			text: '',
			textExpression: false,
			size: 'auto',
			png64:
				'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',
			alignment: 'center:center',
			pngalignment: 'center:center',
			color: 16777215,
			bgcolor: 0,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'osd_ok',
						options: {},
					},
				],
				up: [],
				'500': {
					actions: [
						{
							actionId: 'osd_open_menu',
							options: {},
						},
					],
					options: {
						runWhileHeld: true,
					},
				},
			},
		],
		feedbacks: [
			{
				feedbackId: 'osd_visible_feedback',
				options: {},
				style: {
					bgcolor: 8421631,
					color: 0,
				},
			},
		],
	}

	self.setPresetDefinitions(presets)
}

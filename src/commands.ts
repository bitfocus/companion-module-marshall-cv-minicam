export const viscaCommands = {
	osd: {
		open_menu: '8x01060602FF',
		exit_menu: '8x01060603FF',
		toggle_menu: '8x01060610FF',
		menu_ok: '8x017E01020001FF',
		nav_down: '8x01060101010302FF',
		nav_up: '8x01060101010301FF',
		nav_left: '8x01060101010103FF',
		nav_right: '8x01060101010203FF',
	},
	wb: {
		mode: {
			atw: '8x01043500FF',
			indoor: '8x01043501FF',
			outdoor: '8x01043502FF',
			one_push: '8x01043503FF',
			manual: '8x01043505FF',
		},
		gain: {
			red: {
				rest: '8x01040300FF',
				up: '8x01040302FF',
				down: '8x01040303FF',
				direct: '8x01044300000p0qFF',
			},
			blue: {
				rest: '8x01040400FF',
				up: '8x01040402FF',
				down: '8x01040403FF',
				direct: '8x01044400000p0qFF',
			},
		},
	},
}

export const viscaInquiryCommands = {
	SYS_MenuModeInq: '8x090606FF',
	CAM_WBModeInq: '8x090435FF',
	CAM_RGainInq: '8x090443FF',
	CAM_BGainInq: '8x090444FF',
}

export enum viscaResponseCommands {
	FourByteOneParaValue = 'y0500xFF',
	SevenByteTwoParaValues = 'y05000000p0qFF',
	SevenByteFourParaValues = 'y0500p0q0r0sFF',
}

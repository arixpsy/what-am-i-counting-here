import type { ActionReturn } from 'svelte/action'

type LongpressParameters = {
	enabled: boolean
	threshold: number
	delay: number
}
type LongpressAttributes = {
	'on:longpressStart'?: () => void
	'on:longpressEnd'?: () => void
	'on:beforeLongpressMouseUp'?: () => void // Treat as on:click
	'on:longpressMouseUp'?: () => void
}

export function longpress(
	node: HTMLElement,
	{ enabled = true, threshold = 1000, delay = 500 }
): ActionReturn<LongpressParameters, LongpressAttributes> {
	const handleMousedown = () => {
		if (!enabled) return

		const timeout = setTimeout(() => {
			startLongPress()
			node.removeEventListener('mouseup', handleCancelDuringDelay)
			node.removeEventListener('touchend', handleCancelDuringDelay)
		}, delay)

		const handleCancelDuringDelay = () => {
			clearTimeout(timeout)
			node.dispatchEvent(new CustomEvent('beforeLongpressMouseUp'))
			node.removeEventListener('mouseup', handleCancelDuringDelay)
			node.removeEventListener('touchend', handleCancelDuringDelay)
		}

		node.addEventListener('mouseup', handleCancelDuringDelay)
		node.addEventListener('touchend', handleCancelDuringDelay)
	}

	const startLongPress = () => {
		node.dispatchEvent(new CustomEvent('longpressStart'))

		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpressEnd'))
		}, threshold)

		const handleCancel = () => {
			clearTimeout(timeout)
			node.dispatchEvent(new CustomEvent('longpressMouseUp'))
			node.removeEventListener('mousemove', handleCancel)
			node.removeEventListener('mouseup', handleCancel)
			node.removeEventListener('touchend', handleCancel)
		}

		node.addEventListener('mouseout', handleCancel)
		node.addEventListener('mouseup', handleCancel)
		node.addEventListener('touchend', handleCancel)
	}

	node.addEventListener('mousedown', handleMousedown)
	node.addEventListener('touchstart', handleMousedown, { passive: true })

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown)
		},
	}
}

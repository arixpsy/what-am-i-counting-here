import type { ActionReturn } from 'svelte/action'

type VisibleParameters = IntersectionObserverInit & {
	threshold?: number | number[]
}
type VisibleAttributes = {
	'on:visible': () => void
}

export const visible = (
	node: HTMLElement,
	options = {}
): ActionReturn<VisibleParameters, VisibleAttributes> => {
	const observer = new IntersectionObserver(([entry]) => {
		if (entry.isIntersecting) {
			node.dispatchEvent(new CustomEvent('visible'))
		}
	}, options)

	observer.observe(node)

	return {
		destroy() {
			observer.disconnect()
		},
	}
}

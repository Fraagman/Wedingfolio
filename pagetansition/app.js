function initializeAnimations() {
	// links
	gsap.to('.link a', {
		y: 0,
		duration: 1,
		stagger: 0.1,
		ease: 'power4.out',
		delay: 1,
	})

	// hero title
	if (document.querySelector('.hero h1')) {
		const heroText = new SplitType('.hero h1', { types: 'chars' })

		gsap.set(heroText.chars, { y: 400 })

		gsap.to(heroText.chars, {
			y: 0,
			duration: 1,
			stagger: 0.075,
			ease: 'power4.out',
			delay: 1,
		})
	}

	// info text
	if (document.querySelector('.info p')) {
		// clean previous splits (important for page transitions)
		document.querySelectorAll('.info p .line').forEach(line => {
			line.replaceWith(document.createTextNode(line.textContent))
		})

		const text = new SplitType('.info p', {
			types: 'lines',
			tagName: 'div',
			lineClass: 'line',
		})

		text.lines.forEach(line => {
			line.innerHTML = `<span>${line.innerHTML}</span>`
		})

		gsap.set('.info p .line span', {
			y: 400,
			display: 'block',
		})

		gsap.to('.info p .line span', {
			y: 0,
			duration: 2,
			stagger: 0.075,
			ease: 'power4.out',
			delay: 0.25,
		})
	}
}

// initial load
document.addEventListener('DOMContentLoaded', () => {
	initializeAnimations()
})

// view transitions (same logic, just без Lenis)
if (navigation?.addEventListener) {
	navigation.addEventListener('navigate', event => {
		if (
			!event.destination.url.includes(location.origin) ||
			!event.destination.url.endsWith('.html')
		)
			return

		event.intercept({
			handler: async () => {
				const response = await fetch(event.destination.url)
				const text = await response.text()

				const transition = document.startViewTransition(() => {
					const body = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1]
					document.body.innerHTML = body

					const title = text.match(/<title[^>]*>(.*?)<\/title>/i)[1]
					document.title = title
				})

				transition.ready.then(() => {
					window.scrollTo(0, 0)
					initializeAnimations()
				})
			},
			scroll: 'manual',
		})
	})
}

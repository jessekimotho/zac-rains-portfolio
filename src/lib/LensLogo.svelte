<script>
	import { onDestroy, onMount } from 'svelte';
	import { gsap } from 'gsap';

	export let label = 'Zac Rains camera aperture logo. Click for a photography trick.';
	export let delay = '0s';
	export let interactive = true;

	/** @type {SVGSVGElement} */
	let logo;
	/** @type {HTMLButtonElement | HTMLSpanElement} */
	let logoHitArea;
	/** @type {GSAPTimeline | undefined} */
	let activeTimeline;
	let trickIndex = 0;
	let trickName = 'Ready';
	let performing = false;
	let restMode = 1;
	let lastRandomTrick = -1;
	let replacingTrick = false;
	let hovering = false;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let ambientTimer;

	const scheduleAmbientTrick = (firstRun = false) => {
		window.clearTimeout(ambientTimer);
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const wait = firstRun ? gsap.utils.random(1800, 3200) : gsap.utils.random(4200, 7600);
		ambientTimer = window.setTimeout(() => {
			if (document.visibilityState === 'visible' && !performing) playTrick(true);
			else scheduleAmbientTrick();
		}, wait);
	};

	const finishTrick = () => {
		if (!logo) return;
		const parts = [logo, ...logo.querySelectorAll('.lens-ring,.lens-glass,.lens-aperture,.lens-glint,.lens-flash')];
		gsap.set(parts, { clearProps: 'transform,opacity,filter' });
		performing = false;
		restMode = gsap.utils.random(1, 5, 1);
		if (!replacingTrick) scheduleAmbientTrick();
	};

	const playTrick = (randomize = false) => {
		// Ambient motion respects the user's preference, but an intentional click
		// still needs a clear response so the control never feels broken.
		if (!logo || (randomize && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
		const ring = logo.querySelector('.lens-ring');
		const glass = logo.querySelector('.lens-glass');
		const aperture = logo.querySelector('.lens-aperture');
		const glint = logo.querySelector('.lens-glint');
		const flash = logo.querySelector('.lens-flash');
		const targets = [logo, ring, glass, aperture, glint, flash].filter(Boolean);

		window.clearTimeout(ambientTimer);
		replacingTrick = true;
		activeTimeline?.kill();
		replacingTrick = false;
		gsap.killTweensOf(targets);
		gsap.set(targets, { clearProps: 'transform,opacity,filter' });
		gsap.set(flash, { opacity: 0, scale: 0.35 });
		performing = true;

		const tricks = [
			{
				name: 'Shutter snap',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(aperture, { rotation: 20, scale: 0.34, duration: 0.18, ease: 'power3.in' })
					.to(logo, { scale: 0.94, duration: 0.06 }, '<.1')
					.to(flash, { opacity: 0.95, scale: 1, duration: 0.045 }, '<.03')
					.to(flash, { opacity: 0, scale: 1.3, duration: 0.16 })
					.to(aperture, { rotation: 0, scale: 1, duration: 0.42, ease: 'back.out(2)' }, '<')
					.to(logo, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '<')
			},
			{
				name: 'Focus pull',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(glass, { filter: 'blur(2.2px)', scale: 1.16, duration: 0.3, ease: 'power2.inOut' })
					.to(ring, { scale: 1.13, opacity: 0.45, duration: 0.3 }, '<')
					.to(glass, { filter: 'blur(0px)', scale: 1, duration: 0.4, ease: 'power3.out' })
					.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }, '<')
					.to(glint, { opacity: 1, duration: 0.12 }, '-=.14')
			},
			{
				name: 'Lens roll',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(aperture, { rotation: 360, scale: 0.86, duration: 0.85, ease: 'power2.inOut' })
					.to(glint, { rotation: -360, opacity: 1, duration: 0.85, ease: 'power2.inOut' }, '<')
					.to(aperture, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
			},
			{
				name: 'Burst mode',
				run: (/** @type {GSAPTimeline} */ tl) => {
					for (let shot = 0; shot < 3; shot += 1) {
						tl.to(aperture, { rotation: `+=8`, scale: 0.48, duration: 0.09, ease: 'power3.in' })
							.to(flash, { opacity: 0.9, scale: 0.9, duration: 0.025 }, '<.05')
							.to(flash, { opacity: 0, scale: 1.15, duration: 0.07 })
							.to(aperture, { scale: 1, duration: 0.11, ease: 'power2.out' }, '<');
					}
					return tl.to(aperture, { rotation: 0, duration: 0.2 });
				}
			},
			{
				name: 'Exposure sweep',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.fromTo(glint, { x: -10, y: 5, opacity: 0 }, { x: 10, y: -5, opacity: 1, duration: 0.65, ease: 'power2.inOut' })
					.to(glass, { filter: 'brightness(1.8)', duration: 0.18 }, '-=.34')
					.to(glass, { filter: 'brightness(1)', duration: 0.3 })
					.to(glint, { x: 0, y: 0, opacity: 0.55, duration: 0.22 }, '<')
			},
			{
				name: 'Rack focus',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(logo, { filter: 'blur(1.8px)', scale: 0.9, duration: 0.24, ease: 'power2.in' })
					.to(logo, { filter: 'blur(0px)', scale: 1.08, duration: 0.32, ease: 'power3.out' })
					.to(ring, { scale: 0.91, duration: 0.18 }, '<')
					.to(logo, { scale: 1, duration: 0.28, ease: 'back.out(2)' })
					.to(ring, { scale: 1, duration: 0.28 }, '<')
			},
			{
				name: 'Film advance',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(logo, { x: -8, rotation: -7, duration: 0.16, ease: 'power2.in' })
					.to(aperture, { rotation: 120, duration: 0.38, ease: 'steps(4)' }, '<')
					.to(logo, { x: 5, rotation: 4, duration: 0.18, ease: 'power2.out' })
					.to(logo, { x: 0, rotation: 0, duration: 0.32, ease: 'elastic.out(1,.45)' })
					.to(aperture, { rotation: 0, duration: 0.28 }, '<')
			},
			{
				name: 'Rain on glass',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(glint, { y: 11, opacity: 0.1, duration: 0.38, ease: 'power2.in' })
					.to(glint, { y: -3, opacity: 0.9, duration: 0.18, ease: 'power3.out' })
					.to(glint, { y: 0, opacity: 0.55, duration: 0.24 })
					.to(glass, { scale: 1.1, opacity: 0.65, duration: 0.24 }, '<-.18')
					.to(glass, { scale: 1, opacity: 1, duration: 0.32, ease: 'sine.out' })
			},
			{
				name: 'Long exposure',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(ring, { filter: 'drop-shadow(0 0 7px #ff5b1a)', scale: 1.08, duration: 0.45, ease: 'sine.inOut' })
					.to(aperture, { rotation: 150, scale: 0.72, duration: 1.05, ease: 'sine.inOut' }, '<')
					.to(glass, { opacity: 0.35, duration: 0.5 }, '<')
					.to(ring, { filter: 'drop-shadow(0 0 0px #ff5b1a)', scale: 1, duration: 0.45 })
					.to(aperture, { rotation: 0, scale: 1, duration: 0.45, ease: 'power2.out' }, '<')
					.to(glass, { opacity: 1, duration: 0.35 }, '<')
			},
			{
				name: 'Golden-hour wink',
				run: (/** @type {GSAPTimeline} */ tl) => tl
					.to(logo, { rotation: -9, scale: 1.08, duration: 0.2, ease: 'power2.out' })
					.to(aperture, { scaleY: 0.18, rotation: 8, duration: 0.16, ease: 'power3.in' })
					.to(flash, { opacity: 0.7, scale: 0.75, duration: 0.06 }, '<.06')
					.to(flash, { opacity: 0, scale: 1.1, duration: 0.12 })
					.to(aperture, { scaleY: 1, rotation: 0, duration: 0.3, ease: 'back.out(2.5)' })
					.to(logo, { rotation: 0, scale: 1, duration: 0.42, ease: 'elastic.out(1,.45)' }, '<')
			}
		];

		let selectedIndex = trickIndex % tricks.length;
		if (randomize) {
			do selectedIndex = gsap.utils.random(0, tricks.length - 1, 1);
			while (selectedIndex === lastRandomTrick && tricks.length > 1);
			lastRandomTrick = selectedIndex;
		} else {
			trickIndex += 1;
		}
		const trick = tricks[selectedIndex];
		trickName = `${trick.name}. ${selectedIndex + 1} of ${tricks.length}.`;
		activeTimeline = gsap.timeline({ defaults: { transformOrigin: 'center center' }, onComplete: finishTrick, onInterrupt: finishTrick });
		trick.run(activeTimeline);
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) activeTimeline.timeScale(1.8);
	};

	onMount(() => {
		restMode = gsap.utils.random(1, 5, 1);
		scheduleAmbientTrick(true);
		/** @param {PointerEvent} event */
		const handlePointerMove = (event) => {
			if (!logoHitArea) return;
			if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			const bounds = logoHitArea.getBoundingClientRect();
			const nearestX = Math.max(bounds.left, Math.min(event.clientX, bounds.right));
			const nearestY = Math.max(bounds.top, Math.min(event.clientY, bounds.bottom));
			const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY);
			const proximity = Math.max(0, 1 - distance / 300);
			logoHitArea.style.setProperty('--proximity-scale', String(1 + proximity * 0.42));
			logoHitArea.style.setProperty('--proximity-glow', `${proximity * 14}px`);
			logoHitArea.style.setProperty('--proximity-alpha', String(0.08 + proximity * 0.34));
		};
		const handlePointerEnter = () => {
			hovering = true;
			logoHitArea.style.setProperty('--proximity-scale', '1.42');
			logoHitArea.style.setProperty('--proximity-glow', '14px');
			logoHitArea.style.setProperty('--proximity-alpha', '.42');
		};
		const handlePointerLeave = () => {
			hovering = false;
			logoHitArea.style.setProperty('--proximity-scale', '1');
			logoHitArea.style.setProperty('--proximity-glow', '0px');
			logoHitArea.style.setProperty('--proximity-alpha', '0');
		};
		/** @param {MouseEvent} event */
		const handlePointerLeaveWindow = (event) => {
			if (event.relatedTarget === null) {
				logoHitArea.style.setProperty('--proximity-scale', '1');
				logoHitArea.style.setProperty('--proximity-glow', '0px');
				logoHitArea.style.setProperty('--proximity-alpha', '0');
			}
		};
		const handleVisibility = () => {
			if (document.visibilityState === 'visible' && !performing) scheduleAmbientTrick(true);
			else window.clearTimeout(ambientTimer);
		};
		const handleBeforePrint = () => {
			window.clearTimeout(ambientTimer);
			replacingTrick = true;
			activeTimeline?.kill();
			finishTrick();
			replacingTrick = false;
		};
		const handleAfterPrint = () => scheduleAmbientTrick(true);
		document.addEventListener('visibilitychange', handleVisibility);
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		logoHitArea?.addEventListener('pointerenter', handlePointerEnter);
		logoHitArea?.addEventListener('pointerleave', handlePointerLeave);
		window.addEventListener('mouseout', handlePointerLeaveWindow);
		window.addEventListener('beforeprint', handleBeforePrint);
		window.addEventListener('afterprint', handleAfterPrint);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibility);
			window.removeEventListener('pointermove', handlePointerMove);
			logoHitArea?.removeEventListener('pointerenter', handlePointerEnter);
			logoHitArea?.removeEventListener('pointerleave', handlePointerLeave);
			window.removeEventListener('mouseout', handlePointerLeaveWindow);
			window.removeEventListener('beforeprint', handleBeforePrint);
			window.removeEventListener('afterprint', handleAfterPrint);
		};
	});

	onDestroy(() => {
		if (typeof window === 'undefined') return;
		window.clearTimeout(ambientTimer);
		replacingTrick = true;
		activeTimeline?.kill();
	});
</script>

{#snippet logoMark()}
	<svg bind:this={logo} class:is-performing={performing} class:rest-float={restMode === 1} class:rest-sway={restMode === 2} class:rest-hover={restMode === 3} class:rest-drift={restMode === 4} class:rest-glow={restMode === 5} viewBox="0 0 60 44" role="img" aria-hidden="true">
		<circle class="lens-ring" cx="30" cy="22" r="15" />
		<circle class="lens-glass" cx="30" cy="22" r="11" />
		<g class="lens-aperture">
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" />
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" transform="rotate(60 30 22)" />
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" transform="rotate(120 30 22)" />
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" transform="rotate(180 30 22)" />
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" transform="rotate(240 30 22)" />
			<path d="M30 12a10 10 0 0 1 8.66 5l-6.85 3.96z" transform="rotate(300 30 22)" />
		</g>
		<path class="lens-glint" d="M22.5 18.2a9 9 0 0 1 4.4-4" />
		<circle class="lens-flash" cx="30" cy="22" r="11" />
	</svg>
	<span class="sr-status" aria-live="polite">{trickName}</span>
{/snippet}

{#if interactive}
	<button bind:this={logoHitArea} class="lens-logo" class:is-hovering={hovering} type="button" style:--logo-delay={delay} aria-label={label} onclick={(event) => { event.stopPropagation(); playTrick(); }}>
		{@render logoMark()}
	</button>
{:else}
	<span bind:this={logoHitArea} class="lens-logo" class:is-hovering={hovering} style:--logo-delay={delay} aria-hidden="true">
		{@render logoMark()}
	</span>
{/if}

<style>
	.lens-logo{display:block;width:100%;aspect-ratio:60/44;margin:0;padding:0;border:0;background:none;color:inherit;cursor:pointer;overflow:visible;position:relative;line-height:0;touch-action:manipulation;transform:scale(var(--proximity-scale,1));filter:drop-shadow(0 0 var(--proximity-glow,0px) rgba(255,91,26,var(--proximity-alpha,0)));transform-origin:center;transition:transform .18s cubic-bezier(.2,.85,.25,1),filter .22s ease;will-change:transform,filter}
	.lens-logo:focus-visible{outline:2px solid #ff5b1a;outline-offset:5px;border-radius:50%}
	.lens-logo svg{display:block;width:100%;height:100%;overflow:visible;transition:filter .25s ease}
	.lens-logo:hover svg{filter:drop-shadow(0 0 9px rgba(255,91,26,.38))}
	.lens-logo.is-hovering svg{filter:drop-shadow(0 0 10px rgba(255,91,26,.42))}
	.lens-ring,.lens-aperture,.lens-glint,.lens-flash{transform-box:fill-box;transform-origin:center}
	.lens-ring,.lens-aperture,.lens-glint{animation-duration:5.8s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-delay:var(--logo-delay)}
	.lens-ring{fill:none;stroke:#f1eee7;stroke-width:2.5;animation-name:lens-breathe-ring}
	.lens-glass{fill:rgba(255,91,26,.1);stroke:rgba(255,91,26,.65);stroke-width:1}
	.lens-aperture{fill:#ff5b1a;animation-name:lens-breathe-aperture}
	.lens-glint{fill:none;stroke:#f1eee7;stroke-width:1.7;stroke-linecap:round;opacity:.55;animation-name:lens-breathe-glint}
	.lens-flash{fill:#f1eee7;opacity:0;pointer-events:none}
	.rest-float{animation:logo-rest-float 6.4s ease-in-out var(--logo-delay) infinite}
	.rest-sway{animation:logo-rest-sway 7.6s ease-in-out var(--logo-delay) infinite}
	.rest-hover{animation:logo-rest-hover 5.2s ease-in-out var(--logo-delay) infinite}
	.rest-drift{animation:logo-rest-drift 8.4s ease-in-out var(--logo-delay) infinite}
	.rest-glow{animation:logo-rest-glow 6.8s ease-in-out var(--logo-delay) infinite}
	/* A paused CSS animation still owns `transform` in the cascade and masks
	   GSAP's inline transforms. Remove it for the brief trick, then let the
	   normal rest animation resume when the timeline completes. */
	.is-performing,.is-performing .lens-ring,.is-performing .lens-aperture,.is-performing .lens-glint{animation:none!important}
	.sr-status{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
	@keyframes lens-breathe-ring{0%,100%{opacity:.88;transform:scale(1)}50%{opacity:1;transform:scale(1.022)}}
	@keyframes lens-breathe-aperture{0%,100%{transform:rotate(-1.5deg) scale(.97)}50%{transform:rotate(2.5deg) scale(1.025)}}
	@keyframes lens-breathe-glint{0%,100%{opacity:.44;transform:translate(-.5px,.4px)}50%{opacity:.76;transform:translate(.7px,-.5px)}}
	@keyframes logo-rest-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}
	@keyframes logo-rest-sway{0%,100%{transform:rotate(-.45deg)}50%{transform:rotate(.65deg)}}
	@keyframes logo-rest-hover{0%,100%{transform:scale(.995)}50%{transform:scale(1.018)}}
	@keyframes logo-rest-drift{0%,100%{transform:translate(-.5px,.3px)}50%{transform:translate(.7px,-.4px)}}
	@keyframes logo-rest-glow{0%,100%{filter:drop-shadow(0 0 0 rgba(255,91,26,0))}50%{filter:drop-shadow(0 0 3px rgba(255,91,26,.22))}}
	@media(prefers-reduced-motion:reduce){.lens-ring,.lens-aperture,.lens-glint,.lens-flash,.rest-float,.rest-sway,.rest-hover,.rest-drift,.rest-glow{animation:none;transform:none}.lens-flash{opacity:0}.lens-logo:hover svg{filter:none}}
	@media print{.lens-logo svg,.lens-ring,.lens-aperture,.lens-glint,.lens-flash{animation:none!important}.lens-logo{cursor:default}.lens-logo:focus-visible{outline:0}}
</style>

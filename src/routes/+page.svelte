<script>
	import { onMount } from 'svelte';

	/** @param {string} filename */
	const asset = (filename) => `/${encodeURIComponent(filename)}`;
	const portrait = asset('707453577_17965332306081022_639360383094076295_n.jpg');
	const heroSlides = [
		['reel-tsavo.jpg', 'Tsavo west'],
		['reel-giraffe.jpg', 'Wild things'],
		['reel-rhino.jpg', 'Untamed'],
		['reel-baobab.jpg', 'Solitude']
	];
	const reel = [
		['reel-tsavo.jpg', '01 / Tsavo west', 'wildlife / kenya'],
		['reel-giraffe.jpg', '02 / Wild things', 'wildlife / 2024'],
		['reel-rhino.jpg', '03 / Untamed', 'wildlife / 2024'],
		['reel-baobab.jpg', '04 / Solitude', 'landscape / kenya'],
		['reel-open-country.jpg', '05 / Open country', 'light / 2024'],
		['reel-portrait.jpg', '06 / Final edits', 'portrait / 2024'],
		['zacrains_Great_day_at_Tsavo_West_National_Park_2024-04-27_C6RmYO2sZEt_3355631988352586029.jpg', '07 / Great day', 'wildlife / tsavo'],
		['zacrains_Where_the_wild_things_roam..._🦒🦒_2024-07-12_C9UCViVMitB_3410361093891173185.jpg', '08 / Wild things', 'wildlife / kenya'],
		['zacrains_Majestic_and_untamed_#SavannahLife_#Rhinos_#KenyaWildlife_#M_2024-07-09_C9MPiDUsr12_3408167328740982134.jpg', '09 / Untamed', 'wildlife / kenya'],
		['zacrains_Nature’s_jaws_of_steel!_This_Nile_crocodile_in_Kenya’s_water_2024-07-09_C9NY1OlMZ4c_3408489703894261276.jpg', '10 / Jaws of steel', 'wildlife / kenya'],
		['zacrains_Solitude_and_strength🌳_#Kenya_#Wilderness_#tsavowest_#baobab_2024-07-29_C-AVEwmuciX_3422828402845534359.jpg', '11 / Solitude', 'landscape / tsavo'],
		['zacrains_Touching_the_gentle_giant_2024-08-01_C-Ioh-Nu9BB_3425165773020844097.jpg', '12 / Gentle giant', 'wildlife / kenya'],
		['zacrains_Final_edits_from_this_week🤩🤩_#absolutlystunning_2024-06-02_C7uHG8usL52_3381671634052103798.jpg', '13 / Quiet plains', 'wildlife / kenya'],
		['zacrains_One_of_my_favorite_nights_to_photograph_every_year._🇺🇸🦅🎆_2026-07-05_DaZjZvCjoNC_3934331449608405826.jpg', '14 / After dark', 'night / 2026']
	];
	// Keep the reel limited to filenames verified in /static. The original
	// social-export names above contain characters that can be corrupted in URLs.
	reel.splice(6, 8,
		['zacrains_Great_day_at_Tsavo_West_National_Park_2024-04-27_C6RmYO2sZEt_3355631988352586029.jpg', '07 / Great day', 'wildlife / tsavo'],
		['zacrains_Great_day_at_Tsavo_West_National_Park_2024-04-27_C6RmYO2sZEt_3355631988352586029_2.jpg', '08 / Tsavo light', 'wildlife / tsavo'],
		['zacrains_Great_day_at_Tsavo_West_National_Park_2024-04-27_C6RmYO2sZEt_3355631988352586029_3.jpg', '09 / Wild country', 'wildlife / tsavo'],
		['zacrains_2024-07-13_C9XuO6YM2JB_3411398577651671617.jpg', '10 / Blue water', 'light / 2024'],
		['zacrains_Kenya_is_such_a_beautiful_country!🇰🇪🇰🇪_2024-04-17_C53pP9Qszq7_3348326264450792123.jpg', '11 / Wide open', 'landscape / kenya'],
		['zacrains_2024-08-27_C_J4I_xO-Oz_3443530298933633971.jpg', '12 / Red in the woods', 'motion / 2024'],
		['zacrains_Touching_the_gentle_giant_2024-08-01_C-Ioh-Nu9BB_3425165773020844097.jpg', '13 / Gentle giant', 'wildlife / kenya'],
		['zacrains_Touching_the_gentle_giant_2024-08-01_C-Ioh-Nu9BB_3425165773020844097_2.jpg', '14 / Close encounter', 'wildlife / kenya']
	);
	let cardFlipped = false;
	const cardBg = asset('776442682_1588100949420590_8353220821612154198_n.jpg');
	/** @param {PointerEvent} event */
	const handleCardPointerMove = (event) => {
		if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('low-power')) return;
		const card = event.currentTarget;
		if (!(card instanceof HTMLElement)) return;
		const bounds = card.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;
		const tiltX = (x - 0.5) * 10;
		const tiltY = (0.5 - y) * 8;
		const shiftX = (x - 0.5) * 18;
		const shiftY = (y - 0.5) * 14;

		card.style.setProperty('--card-tilt-x', `${tiltX}deg`);
		card.style.setProperty('--card-tilt-y', `${tiltY}deg`);
		card.style.setProperty('--card-shift-x', `${shiftX}px`);
		card.style.setProperty('--card-shift-y', `${shiftY}px`);
		card.style.setProperty('--card-glare-x', `${x * 100}%`);
		card.style.setProperty('--card-glare-y', `${y * 100}%`);
	};

	/** @param {PointerEvent} event */
	const resetCardPointer = (event) => {
		const card = event.currentTarget;
		if (!(card instanceof HTMLElement)) return;
		card.style.removeProperty('--card-tilt-x');
		card.style.removeProperty('--card-tilt-y');
		card.style.removeProperty('--card-shift-x');
		card.style.removeProperty('--card-shift-y');
		card.style.removeProperty('--card-glare-x');
		card.style.removeProperty('--card-glare-y');
	};
	/** @param {number} seed */
	const seededRandom = (seed) => {
		const value = Math.sin(seed * 12.9898) * 43758.5453;
		return value - Math.floor(value);
	};
	const rainDrops = Array.from({ length: 250 }, (_, index) => ({
		x: Math.floor(seededRandom(index + 1) * 100),
		y: Math.floor(seededRandom(index + 101) * 100),
		opacity: (0.13 + seededRandom(index + 201) * 0.28).toFixed(2),
		duration: (0.85 + seededRandom(index + 301) * 1.35).toFixed(2),
		delay: (-seededRandom(index + 401) * 2.2).toFixed(2),
		scale: (0.38 + seededRandom(index + 501) * 0.62).toFixed(2)
	}));

	onMount(() => {
		/** @type {(() => void) | undefined} */
		let cleanup;
		let destroyed = false;

		Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
			if (destroyed) return;
		const { gsap } = gsapModule;
			const { ScrollTrigger } = scrollTriggerModule;
			gsap.registerPlugin(ScrollTrigger);
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const deviceMemory = Number(Reflect.get(navigator, 'deviceMemory') || 8);
		const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4 || deviceMemory <= 4;
		const compactLayout = window.matchMedia('(max-width: 760px)').matches;
		document.documentElement.classList.toggle('low-power', lowPowerDevice);
		if (reduceMotion) return;
		const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
		intro.from('.hero-identity', { y: 45, opacity: 0, duration: 1 })
			.from('.hero-portrait', { clipPath: 'inset(0 0 100% 0)', scale: 1.12, duration: 1.4 }, '-=.65');

		if (!lowPowerDevice) {
			gsap.to('.hero-slide img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
		}
		// Give the vertical page scroll a layered, camera-like depth. Positive
		// values drift down as the section passes; negative values drift up.
		/** @type {Array<[string, number]>} */
		const parallaxLayers = [
			['.hero-portrait', 0.06],
			['.about h2', -0.08],
			['.about-portrait img', 0.12],
			['.large-copy', -0.06],
			['.contact h2', -0.08]
		];
		if (!lowPowerDevice) {
			parallaxLayers.forEach(([selector, speed]) => {
				const element = document.querySelector(selector);
				if (!element) return;
				const distance = () => window.innerHeight * speed;
				gsap.fromTo(element, { y: () => -distance() }, { y: () => distance(), ease: 'none', scrollTrigger: {
					trigger: element,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
					invalidateOnRefresh: true
				} });
			});
		}
		const ambientBackground = document.querySelector('.ambient-background');
		if (ambientBackground) {
			const sections = gsap.utils.toArray('.chapter');
			const colors = ['#0a0e0e', '#edf0e8', '#111817', '#4ca6d8'];
			const transition = 0.08;
			const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			const backgroundTimeline = gsap.timeline({
				scrollTrigger: { trigger: '.shell', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true }
			});
			let cursor = 0;
			sections.forEach((section, index) => {
				if (index === 0) {
					gsap.set(ambientBackground, { backgroundColor: colors[0] });
					return;
				}
				const point = () => section.offsetTop / maxScroll();
				const start = () => Math.max(cursor, point() - transition / 2);
				backgroundTimeline.to({}, { duration: () => Math.max(0, start() - cursor) });
				backgroundTimeline.to(ambientBackground, { backgroundColor: colors[index], duration: transition, ease: 'none' });
				cursor = Math.min(1, point() + transition / 2);
			});
		}
		const aboutRain = document.querySelector('.about-rain');
		if (aboutRain) {
			if (lowPowerDevice) {
				gsap.set(aboutRain, { autoAlpha: 0 });
			} else {
			// The rain is strongest while the about section is settled in view,
			// then dissolves before the next chapter takes over.
			gsap.set(aboutRain, { autoAlpha: 0 });
			ScrollTrigger.create({
				trigger: '.about',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					const fadeIn = Math.min(1, self.progress / 0.14);
					const fadeOut = Math.min(1, (1 - self.progress) / 0.18);
					gsap.set(aboutRain, { autoAlpha: Math.min(fadeIn, fadeOut) });
				}
			});
			}
		}
		const slides = gsap.utils.toArray('.hero-slide');
		let activeSlide = 0;
		gsap.set(slides.slice(1), { autoAlpha: 0 });
		const slideshow = gsap.delayedCall(4, function advanceSlide() {
			const nextSlide = (activeSlide + 1) % slides.length;
			gsap.timeline().to(slides[activeSlide], { autoAlpha: 0, duration: 1.1, ease: 'power2.inOut' }).to(slides[nextSlide], { autoAlpha: 1, duration: 1.1, ease: 'power2.inOut' }, '<');
			activeSlide = nextSlide;
			slideshow.restart(true);
		});
		gsap.utils.toArray('.reveal').forEach((element) => {
			gsap.from(element, { y: 65, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 82%' } });
		});
		/** @type {HTMLElement | null} */
		const reelTrack = document.querySelector('.reel-track');
		/** @type {HTMLElement | null} */
		const reelIntro = document.querySelector('.reel-intro');
		/** @type {HTMLElement | null} */
		const reelKeep = reelIntro ? reelIntro.querySelector('h2 em') : null;
		/** @type {HTMLElement | null} */
		const rippleField = document.querySelector('.work-puddles');
		/** @type {HTMLElement | null} */
		const firstReelCard = document.querySelector('.reel-card');
		if (reelTrack && reelIntro && firstReelCard && !compactLayout) {
			if (rippleField) gsap.set(rippleField, { opacity: 0 });
			// Stop with a large, intentional landing gap after the final frame.
			// This is part of the translate distance, so the last image remains
			// fully visible instead of being pushed off the right edge.
			const trailingGap = () => window.innerWidth <= 760
				? Math.max(96, window.innerWidth * 0.24)
				: Math.min(760, Math.max(360, window.innerWidth * 0.42));
			const trackStart = () => Math.max(0, reelTrack.offsetLeft);
			const distance = () => Math.max(0, trackStart() + reelTrack.scrollWidth - window.innerWidth + trailingGap());
			// Hold the intro in place long enough to read and use it before the
			// first frame starts travelling across the section.
			const introPause = () => window.innerHeight * 2.1;
			const scrollEnd = () => `+=${distance() + introPause()}`;
			const fadeBounds = () => {
				const totalDistance = distance();
				const pauseDistance = introPause();
				const totalScroll = totalDistance + pauseDistance;
				const travelStart = totalScroll ? pauseDistance / totalScroll : 0;
				const travelSpan = totalScroll ? totalDistance / totalScroll : 1;
				// Both elements use different offset parents, so include the track's
				// starting position before comparing their horizontal bounds.
				const firstCardStart = reelTrack.offsetLeft + firstReelCard.offsetLeft;
				const introStart = reelIntro.offsetLeft;
				const overlapStart = firstCardStart - (introStart + reelIntro.offsetWidth);
				const overlapEnd = firstCardStart + firstReelCard.offsetWidth - introStart;
				const overlap = Math.max(0, overlapEnd - overlapStart);
				return {
					// Start fading as soon as the first image reaches the intro and
					// finish shortly after it has crossed the copy.
					start: travelStart + (totalDistance ? Math.max(0, overlapStart) / totalDistance * travelSpan : 0),
					end: travelStart + (totalDistance ? Math.min(1, (overlapEnd + overlap * 0.1) / totalDistance) * travelSpan : travelSpan)
				};
			};
			let cachedFadeStart = 0;
			let cachedFadeEnd = 1;
			const refreshFadeBounds = () => {
				const bounds = fadeBounds();
				cachedFadeStart = bounds.start;
				cachedFadeEnd = bounds.end;
			};
			const setIntroOpacity = gsap.quickSetter(reelIntro, 'opacity');
			const setRippleOpacity = rippleField ? gsap.quickSetter(rippleField, 'opacity') : null;
			const setKeepColor = reelKeep ? gsap.quickSetter(reelKeep, 'color') : null;
			const reelScrollTrigger = {
				trigger: '.work-reel',
				start: 'top top',
				end: scrollEnd,
				pin: true,
				anticipatePin: 1,
				scrub: 1,
				invalidateOnRefresh: true,
				onRefresh: refreshFadeBounds,
				/** @param {{ progress: number }} self */
				onUpdate: (self) => {
					const { progress } = self;
					const fade = Math.min(1, Math.max(0, (progress - cachedFadeStart) / Math.max(0.001, cachedFadeEnd - cachedFadeStart)));
					setIntroOpacity(1 - fade);
					if (setRippleOpacity) {
						// Bring the ripples in after the gallery title clears, then remove
						// them before the contact section enters the viewport.
						const rippleStart = Math.min(0.88, cachedFadeEnd + 0.04);
						const rippleEnd = Math.max(rippleStart + 0.08, 0.94);
						const rippleIn = Math.min(1, Math.max(0, (progress - rippleStart) / 0.08));
						const rippleOut = Math.min(1, Math.max(0, (rippleEnd - progress) / 0.08));
						setRippleOpacity(rippleIn * rippleOut);
					}
					if (setKeepColor) {
						// Start shifting as soon as the pinned section begins, and finish
						// the color change before the copy starts fading.
						const colorProgress = Math.min(1, Math.max(0, progress / Math.max(0.001, cachedFadeStart)));
						const deepBlue = gsap.utils.interpolate('#4ca6d8', '#2d6f98', colorProgress);
						setKeepColor(deepBlue);
					}
				}
			};
			refreshFadeBounds();
			const reelTimeline = gsap.timeline({ scrollTrigger: reelScrollTrigger });
			reelTimeline.to({}, { duration: () => introPause() / Math.max(1, distance()) })
				.to(reelTrack, { x: () => -distance(), duration: 1, ease: 'none', force3D: true });
		}
			cleanup = () => {
				slideshow.kill();
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			};
		});

		return () => {
			destroyed = true;
			cleanup?.();
		};
	});
</script>

<svelte:head>
	<title>Zac Rains — Photography for rainy days &amp; golden hours</title>
	<meta name="description" content="Zac Rains is a Wisconsin photographer turning weather, wild places, and honest moments into photographs that feel like rain on glass." />
</svelte:head>

	<div class="shell">
		<div class="ambient-background" aria-hidden="true">
			<span class="storm-rain"></span><span class="storm-flash"></span>
		</div>
	<main>
		<section class="hero chapter" id="top">
			<div class="hero-copy-wrap">
				<div class="hero-identity" aria-label="Zac Rains, photographer">
					<svg class="hero-mark" viewBox="0 0 60 44" role="img" aria-label="Rain cloud logo mark">
						<path class="cloud" d="M12,26 C6,26 6,18 12,17 C14,11 22,9 27,12 C31,7 39,7 44,12 C49,11 51,18 48,21 C51,24 48,28 43,28 H14 C10,28 10,26 12,26 Z" />
						<g class="drops"><line x1="18" y1="29" x2="16" y2="40" class="drop" /><line x1="30" y1="29" x2="28" y2="43" class="drop drop-mid" /><line x1="42" y1="29" x2="40" y2="40" class="drop" /></g>
					</svg>
					<h1 class="hero-name">Zac <span>Rains</span></h1>
					<p class="hero-role">Photographer</p>
				</div>
			</div>
			<div class="hero-portrait" aria-label="Selected photography slideshow">{#each heroSlides as slide, i}<div class="hero-slide"><img src={asset(slide[0])} alt={slide[1]} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" /></div>{/each}</div>
		</section>

		<div class="rain-break" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
		<section class="about chapter" id="about">
			<div class="about-rain" aria-hidden="true">
				{#each rainDrops as drop}
					<svg class="about-rain__drop" preserveAspectRatio="xMinYMin meet" viewBox="0 0 5 50" style={`--x:${drop.x};--y:${drop.y};--o:${drop.opacity};--a:${drop.duration};--d:${drop.delay};--s:${drop.scale}`}>
						<path d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z" />
					</svg>
				{/each}
			</div>
			<div class="section-top reveal"><p class="eyebrow"><span>02</span> The person behind the storm</p><span class="section-index">ABOUT / 2026</span></div>
			<div class="about-layout"><div class="about-heading reveal"><p class="side-note">A little<br />about me</p><h2>Hi, I'm<br /><em>Zac.</em></h2></div><div class="about-portrait reveal"><img src={portrait} alt="Zac Rains smiling outdoors" /><span>THE GUY<br />BEHIND THE<br />LENS ↘</span></div><div class="about-text reveal"><p class="large-copy">Photographer, storm chaser, and professional third wheel.</p><p>I chase the kind of images that feel like weather — a little imperfect, always honest, and impossible to fake. From Wisconsin back roads to the wild edges of Kenya, I wait for the split second that makes a story stick.</p><div class="facts"><span>Portraits</span><span>Weddings</span><span>Families</span><span>Wild places</span></div></div></div>
			<div class="about-marquee" aria-hidden="true"><div class="about-marquee-track"><span><b>RAINS</b> / CLOUDS / WIND / LIGHT / WEATHER / </span><span><b>RAINS</b> / CLOUDS / WIND / LIGHT / WEATHER / </span></div><div class="about-marquee-track"><span><b>RAINS</b> / CLOUDS / WIND / LIGHT / WEATHER / </span><span><b>RAINS</b> / CLOUDS / WIND / LIGHT / WEATHER / </span></div></div>
		</section>

		<section class="work-reel chapter" id="work">
			<div class="contact-puddles work-puddles" aria-hidden="true"><span class="puddle puddle-a"><i></i></span><span class="puddle puddle-b"><i></i></span><span class="puddle puddle-c"><i></i></span><span class="puddle puddle-d"><i></i></span></div>
			<div class="reel-intro"><p class="eyebrow"><span>03</span> Selected work</p><h2>Frames<br /><em>worth<br />keeping.</em></h2><p class="reel-hint">Keep scrolling<br /><span>→</span></p></div>
			<div class="reel-track">{#each reel as item, i}<div class:hero-card={i === 0} class="reel-card"><div class="reel-photo"><img src={asset(item[0])} alt={item[1]} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" /></div><div class="reel-meta"><strong>{item[1]}</strong><span>{item[2]}</span></div></div>{/each}</div>
		</section>

		<section class="contact chapter" id="contact">
			<div class="section-top"><p class="eyebrow"><span>04</span> Before the storm</p><span class="section-index">LET'S CONNECT</span></div>
			<div class="contact-layout"><div><h2>Let's make<br /><em>something</em><br />real.</h2><a class="email" href="mailto:astrozac@outlook.com">astrozac@outlook.com <span>↗</span></a></div><button class="business-card" class:flipped={cardFlipped} onpointermove={handleCardPointerMove} onpointerleave={resetCardPointer} onclick={() => (cardFlipped = !cardFlipped)} aria-label="Flip Zac Rains business card" aria-pressed={cardFlipped}>
				<span class="card-face card-front" style="--card-bg: url({cardBg})">
					<span class="card-topline"><span>01 / PERSONAL CARD</span><span>EST. 2024</span></span>
					<span class="card-brand">
						<svg class="card-mark" viewBox="0 0 60 44" aria-hidden="true"><path class="cloud" d="M12,26 C6,26 6,18 12,17 C14,11 22,9 27,12 C31,7 39,7 44,12 C49,11 51,18 48,21 C51,24 48,28 43,28 H14 C10,28 10,26 12,26 Z" /><g class="drops"><line x1="18" y1="29" x2="16" y2="40" class="drop" /><line x1="30" y1="29" x2="28" y2="43" class="drop drop-mid" /><line x1="42" y1="29" x2="40" y2="40" class="drop" /></g></svg>
						<span><b>RAINS</b><small>PHOTOGRAPHY</small></span>
					</span>
					<span class="card-bottomline"><span>WISCONSIN / WORLDWIDE</span><i>Flip to connect ↗</i></span>
				</span>
				<span class="card-face card-back" style="--card-bg: url({cardBg})">
					<span class="back-content">
						<span class="card-info">
							<a href="tel:262-232-9332" class="card-link"><small>CALL</small><span>262—232—9332</span></a>
							<a href="mailto:astrozac@outlook.com" class="card-link"><small>MAIL</small><span>astrozac@outlook.com</span></a>
						</span>
					</span>
				</span>
			</button></div>
			<div class="contact-footer"><span>© {new Date().getFullYear()} Zac Rains Photography</span><span>Good light, even after the rain.</span><a href="#top">Back to top ↑</a></div>
		</section>
	</main>
</div>

<style>
	:global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;overflow-x:hidden;background:#111516;color:#f1eee7}:global(a){color:inherit;text-decoration:none}:global(button){font:inherit}.shell{position:relative;overflow:hidden;background:transparent}.ambient-background{position:fixed;inset:0;z-index:0;pointer-events:none;background:#0a0e0e;will-change:background-color}.puddle{position:absolute;width:clamp(160px,20vw,360px);aspect-ratio:1;border:1px solid rgba(255,91,26,.2);border-radius:50%;opacity:0;transform:scale(.18);animation:puddle-ripple 9s ease-out infinite;will-change:transform,opacity}.puddle::before{content:'';position:absolute;inset:12%;border:1px solid rgba(255,91,26,.14);border-radius:50%;animation:puddle-ring 9s ease-out infinite}.puddle-a{top:8%;left:12%;animation-delay:-1.5s}.puddle-b{top:38%;right:7%;width:clamp(220px,28vw,500px);animation-delay:-5s}.puddle-c{bottom:-4%;left:36%;width:clamp(180px,24vw,420px);animation-delay:-7.2s}.puddle-d{top:57%;left:-5%;width:clamp(130px,16vw,280px);animation-delay:-3.3s}.puddle-b::before{animation-delay:1.4s}.puddle-c::before{animation-delay:2.2s}.puddle-d::before{animation-delay:.8s}@keyframes puddle-ripple{0%{opacity:0;transform:scale(.18)}12%{opacity:.55}68%{opacity:.14}100%{opacity:0;transform:scale(1)}}@keyframes puddle-ring{0%,18%{opacity:0;transform:scale(.35)}35%{opacity:.8}100%{opacity:0;transform:scale(1.08)}}.topbar{height:88px;padding:23px 4.5vw;border-bottom:1px solid rgba(39,53,53,.55);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:10;background:rgba(10,14,14,.18);backdrop-filter:blur(14px)}.logo{display:flex;align-items:center;gap:11px;font-size:14px;font-weight:700;letter-spacing:.13em;line-height:.85}.top-actions{display:flex;align-items:center;gap:25px}.eyebrow,.section-index,.reel-meta,.contact-footer,.card-face small{font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}.email span,.text-link span{color:#ff5b1a;font-style:normal;margin-left:10px}nav{display:flex;gap:39px;margin-left:auto;margin-right:7vw;font:11px 'DM Mono',monospace;text-transform:uppercase;color:#9da9a5;letter-spacing:.08em}nav a:hover,.text-link:hover{color:#ff5b1a}.menu{display:none;background:none;border:0}.chapter{position:relative;z-index:1}.hero{min-height:calc(100vh - 88px);display:grid;grid-template-columns:51% 49%;padding:8vh 7vw 7vh 9vw;isolation:isolate}.hero-copy-wrap{align-self:center;position:relative;z-index:2}.eyebrow{color:#93a09c;margin:0}.eyebrow span{color:#ff5b1a;margin-right:17px}h2{font-size:clamp(5rem,10vw,10.5rem);font-weight:500;line-height:.8;letter-spacing:-.095em;margin:70px 0 48px}h2 em{color:#ff5b1a;font-style:normal}.hero-portrait{position:absolute;z-index:0;right:7vw;top:5vh;width:min(43vw,580px);height:78vh;overflow:hidden;background:#202929;clip-path:polygon(8% 0,100% 0,92% 100%,0 100%)}.hero-portrait:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(5,9,9,.7))}.hero-slide{position:absolute;inset:0}.hero-slide img{width:100%;height:115%;object-fit:cover;object-position:center;filter:saturate(.88) contrast(1.04)}.about{padding:13vh 9vw 0;min-height:100vh;background:transparent;color:#111717;overflow:hidden}.section-top{display:flex;justify-content:space-between;align-items:center}.about .eyebrow{color:#65736f}.section-index{color:#8a9691}.about-layout{display:grid;grid-template-columns:1fr .72fr 1fr;gap:4vw;align-items:end;margin-top:15vh}.about h2{font-size:clamp(5.5rem,11vw,12rem);margin:0;color:#111717}.side-note{font:10px 'DM Mono',monospace;text-transform:uppercase;color:#78837e;line-height:1.6;letter-spacing:.1em;margin-bottom:30px}.about-portrait{position:relative;aspect-ratio:3/4;max-width:280px;overflow:hidden;background:#ccd4c9}.about-portrait img{width:100%;height:100%;object-fit:cover;filter:saturate(.82)}.about-portrait:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(10,14,14,.55))}.about-portrait span{position:absolute;z-index:1;bottom:16px;left:16px;color:#f1eee7;font:10px 'DM Mono',monospace;line-height:1.6;letter-spacing:.08em}.about-text{max-width:420px;padding-bottom:2vh}.large-copy{font-size:clamp(1.55rem,2.4vw,2.5rem);line-height:1.05;letter-spacing:-.04em;margin:0 0 28px}.about-text>p:not(.large-copy){color:#65706c;line-height:1.6;font-size:14px}.facts{display:flex;flex-wrap:wrap;gap:8px;margin:34px 0}.facts span{border:1px solid #b6c0b8;padding:8px 10px;font:10px 'DM Mono',monospace;text-transform:uppercase}.text-link{display:inline-block;border-bottom:1px solid #a6b1aa;padding-bottom:9px;font:11px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.08em}.about-marquee{display:flex;width:max-content;gap:30px;margin-top:16vh;color:#d8ded5;font-size:clamp(4rem,10vw,11rem);font-weight:700;line-height:.7;letter-spacing:-.08em;white-space:nowrap;transform:translateX(-10%)}.about-marquee span:last-child{color:#111717}.work-reel{min-height:100vh;padding:10vh 0 8vh;background:transparent;color:#f1eee7;display:flex;align-items:center;gap:7vw}.reel-intro{flex:0 0 31vw;padding-left:9vw}.reel-intro h2{font-size:clamp(4rem,7vw,8rem);margin:75px 0 55px}.reel-hint{font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:#8f9d98;line-height:2}.reel-hint span{color:#ff5b1a;font-size:25px}.reel-track{display:flex;align-items:flex-start;gap:27px;width:max-content;padding-right:9vw}.reel-card{display:block;width:25vw;min-width:300px}.reel-card.hero-card{width:31vw;min-width:370px;margin-top:-5vh}.reel-photo{position:relative;aspect-ratio:4/5;overflow:hidden;background:#283331}.reel-card.hero-card .reel-photo{aspect-ratio:3/4}.reel-photo img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .5s}.reel-card:hover img{transform:scale(1.07);filter:saturate(1.15)}.view-arrow{position:absolute;right:15px;top:15px;display:grid;place-items:center;width:42px;height:42px;background:#ff5b1a;color:#0a0e0e;border-radius:50%;font-size:20px;opacity:0;transform:translate(-10px,10px);transition:.4s}.reel-card:hover .view-arrow{opacity:1;transform:none}.reel-meta{display:flex;justify-content:space-between;gap:12px;padding-top:15px;color:#96a39e}.reel-meta strong{color:#f1eee7;font-weight:400}.contact{min-height:100vh;padding:11vh 9vw 28px;background:transparent;color:#111817;overflow:hidden}.contact .eyebrow{color:#793119}.contact-glow{position:absolute;width:52vw;height:52vw;right:-15vw;top:8vh;border:1px solid rgba(17,24,23,.3);border-radius:50%;box-shadow:0 0 0 35px rgba(17,24,23,.07),0 0 0 70px rgba(17,24,23,.05);pointer-events:none}.contact-layout{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:8vw;margin-top:13vh}.contact h2{font-size:clamp(5rem,9.5vw,10rem);margin:0 0 55px}.email{display:inline-block;border-bottom:1px solid #111817;padding-bottom:13px;font-size:clamp(1rem,1.8vw,1.5rem);letter-spacing:-.03em}.business-card{width:min(100%,450px);aspect-ratio:1.65;border:0;padding:0;background:none;perspective:1000px;cursor:pointer;text-align:left}.card-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:30px;background:#0e1716;color:#f1eee7;backface-visibility:hidden;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.76,0,.24,1);box-shadow:17px 17px 0 rgba(17,24,23,.16)}.business-card{position:relative}.card-front{transform:rotateY(0deg)}.card-back{transform:rotateY(-180deg);background:#f1eee7;color:#111817}.business-card.flipped .card-front{transform:rotateY(180deg)}.business-card.flipped .card-back{transform:rotateY(0deg)}.card-mark{font:clamp(3rem,7vw,5rem) 'Space Grotesk',sans-serif;color:#ff5b1a;letter-spacing:-.12em}.card-face strong{font-size:clamp(2rem,4vw,4rem);line-height:.8;letter-spacing:-.08em}.card-face small{line-height:1.7}.card-face i{align-self:flex-end;font:10px 'DM Mono',monospace;font-style:normal;color:#ff5b1a}.card-back strong{color:#111817}.card-back em{color:#ff5b1a;font-style:normal}.contact-footer{position:absolute;left:9vw;right:9vw;bottom:28px;display:flex;justify-content:space-between;color:#6f2917}.contact-footer a:hover{color:#111817}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:760px){.topbar{height:75px;padding:19px 18px}:global(.availability),:global(.outline-button){display:none}.menu{display:block;padding:5px}.menu span{display:block;width:24px;height:1px;background:#f1eee7;margin:5px}nav{display:none;position:absolute;top:75px;left:0;right:0;margin:0;padding:24px 18px;flex-direction:column;gap:20px;background:#0a0e0e}nav.open{display:flex}.hero{min-height:calc(100vh - 75px);display:block;padding:60px 18px 35px}:global(.hero-title){font-size:clamp(4.5rem,19vw,7rem);margin:90px 0 38px}.hero-portrait{right:18px;top:38%;width:78vw;height:52vh;opacity:.85}.hero-copy-wrap{position:relative;z-index:2}:global(.hero-copy){margin-bottom:52vh}:global(.hero-orbit){width:92px;height:92px;right:18px;bottom:11vh;font-size:7px}:global(.hero-scroll){left:18px;bottom:35px}.about{padding:70px 18px 0;min-height:100vh}.section-top{align-items:flex-start}.section-index{font-size:8px}.about-layout{display:block;margin-top:90px}.about-portrait{width:70%;max-width:none;margin:0 0 45px auto}.about h2{font-size:clamp(4.8rem,20vw,7rem);margin-bottom:60px}.about-text{padding:0}.about-marquee{margin-top:100px}.work-reel{display:block;padding:80px 0 55px;min-height:auto}.reel-intro{padding:0 18px}.reel-intro h2{font-size:clamp(4rem,18vw,6.5rem);margin:60px 0 30px}.reel-track{width:auto;overflow-x:auto;padding:5px 18px 25px;gap:16px;scroll-snap-type:x mandatory}.reel-card,.reel-card.hero-card{width:78vw;min-width:78vw;margin:0;scroll-snap-align:start}.contact{min-height:900px;padding:70px 18px 30px}.contact-layout{display:block;margin-top:105px}.contact h2{font-size:clamp(4.7rem,19vw,7rem);margin-bottom:45px}.business-card{margin-top:95px;width:100%}.contact-glow{width:100vw;height:100vw;right:-50vw;top:30vh}.contact-footer{left:18px;right:18px;bottom:25px;gap:15px;flex-wrap:wrap}.contact-footer span:nth-child(2){display:none}}
	@media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.hero-slide img,.about-marquee{transform:none!important}:global(.hero-orbit) span,.puddle,.puddle::before{animation:none}.hero-mark .drop,.card-brand .drop{animation:none}.card-face,.reel-photo img{transition:none}}
.rain-mark{display:block;width:38px;height:28px;cursor:pointer;overflow:visible}.rain-mark .cloud{fill:#f1eee7;transition:fill .25s ease,transform .25s ease}.rain-mark:hover .cloud{fill:#ff5b1a;transform:translateY(-2px)}.rain-mark .drop{stroke:#ff5b1a;stroke-width:2.2;stroke-linecap:round;opacity:.9;animation:pour 1.1s linear infinite;transform-origin:center}.rain-mark .drop:nth-child(2){animation-delay:.2s}.rain-mark .drop:nth-child(3){animation-delay:.45s}.rain-mark:hover .drop{animation-duration:.65s}@keyframes pour{0%{transform:translateY(-4px);opacity:0}15%{opacity:1}100%{transform:translateY(16px);opacity:0}}.rain-break{height:80px;display:flex;justify-content:space-evenly;align-items:flex-start;padding:0 20vw;overflow:hidden;background:transparent}.rain-break span{width:1px;height:100%;background:linear-gradient(180deg,transparent 0%,#ff5b1a 45%,transparent 100%);opacity:.35;transform:translateY(-110%);animation:rain-fall 2.2s linear infinite}.rain-break span:nth-child(2n){animation-delay:.3s;animation-duration:2.8s}.rain-break span:nth-child(3n){animation-delay:.8s;animation-duration:1.9s}@keyframes rain-fall{0%{transform:translateY(-110%);opacity:0}20%{opacity:.35}100%{transform:translateY(110%);opacity:0}}.card-front{background:linear-gradient(rgba(10,14,14,.88),rgba(10,14,14,.88)),var(--card-bg)}.card-back{background:linear-gradient(rgba(241,238,231,.9),rgba(241,238,231,.9)),var(--card-bg)}.business-card .card-front,.business-card .card-back{background-size:cover,cover;background-position:center,center}.card-info{display:flex;flex-direction:column;gap:9px;line-height:1.45;margin-top:auto;margin-bottom:8px}:global(.card-info em){font-style:normal;color:#ff5b1a}.card-link{color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.card-link:hover{color:#ff5b1a}@media(max-width:760px){.rain-mark{width:34px;height:25px}}


	.hero{grid-template-columns:44% 56%;padding:6vh 7vw;gap:5vw;min-height:100vh}
	.hero-copy-wrap{display:flex;align-items:flex-start;padding-top:4vh}
	.hero-role{margin:0;color:#ff5b1a;font:12px 'DM Mono',monospace;letter-spacing:.16em;text-transform:uppercase}
	.hero-portrait{width:100%;height:min(78vh,820px);min-height:0;align-self:center;transform:none;clip-path:none}
	.hero-slide{inset:0}
	.hero-slide img{width:100%;height:100%;object-fit:cover}
	.rain-break{display:none}
	@media(max-width:760px){
		.hero{padding:9vh 7vw 10vh;gap:8vh;min-height:100vh}
		.hero-copy-wrap{padding-top:0}
		.hero-role{font-size:10px}
		.hero-portrait{width:100%;height:64vh;min-height:420px}
	}

	/* Signature contact card */
	.contact-layout{align-items:center}
	.business-card{position:relative;width:min(100%,620px);aspect-ratio:1.72;border:0;padding:0;background:transparent;cursor:pointer;perspective:1600px;filter:drop-shadow(0 28px 34px rgba(0,0,0,.28));text-align:left;color:#f1eee7}
	.business-card:focus-visible{outline:2px solid #ff5b1a;outline-offset:9px}
	.card-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;padding:clamp(22px,4vw,46px);border:1px solid rgba(255,255,255,.18);border-radius:2px;backface-visibility:hidden;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.75,.2,1),box-shadow .9s ease}
	.card-face::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(8,11,12,.58) 0%,rgba(8,11,12,.22) 48%,rgba(8,11,12,.56) 100%),var(--card-bg);background-size:cover;background-position:center;z-index:-2;transform:scale(1.04);transition:transform 1.2s ease}
	.card-face::after{content:'';position:absolute;inset:14px;border:1px solid rgba(255,91,26,.45);pointer-events:none;z-index:-1}
	.card-front{transform:rotateY(0deg);box-shadow:inset 0 0 80px rgba(0,0,0,.28)}
	.card-back{transform:rotateY(180deg);background:#111817;color:#f1eee7}
	.card-back::before{background:linear-gradient(115deg,rgba(8,11,12,.62),rgba(8,11,12,.26)),var(--card-bg);background-position:center}
	.business-card.flipped .card-front{transform:rotateY(-180deg)}
	.business-card.flipped .card-back{transform:rotateY(0deg)}
	.business-card:hover .card-face::before{transform:scale(1.09)}
	.card-topline,.card-bottomline{display:flex;justify-content:space-between;align-items:center;gap:20px;color:rgba(241,238,231,.68);font:10px 'DM Mono',monospace;letter-spacing:.13em;text-transform:uppercase}
	.card-topline span:last-child,.card-bottomline span:last-child{color:#ff5b1a}
	.card-brand{display:flex;align-items:center;gap:18px;margin-top:auto;margin-bottom:auto}
	.card-brand .card-mark{width:clamp(60px,10vw,102px);height:auto;overflow:visible;flex:none}
	.card-brand .cloud{fill:#f1eee7}.card-brand .drop{stroke:#ff5b1a;stroke-width:2.2;stroke-linecap:round;animation:pour 1.1s linear infinite;transform-origin:center}.card-brand .drop:nth-child(2){animation-delay:.2s}.card-brand .drop:nth-child(3){animation-delay:.45s}
	.card-brand b{display:block;font-size:clamp(3.5rem,8vw,7.8rem);font-weight:600;line-height:.75;letter-spacing:-.1em}.card-brand small{display:block;margin-top:17px;color:#ff5b1a;font:clamp(9px,1.2vw,13px) 'DM Mono',monospace;letter-spacing:.34em}
	.card-bottomline i{font:11px 'DM Mono',monospace;font-style:normal;letter-spacing:.08em;color:#f1eee7;transition:color .2s ease}.business-card:hover .card-bottomline i{color:#ff5b1a}
	.card-info{display:flex;flex-direction:column;gap:8px;margin:22px 0 28px;font:clamp(10px,1.2vw,13px) 'DM Mono',monospace;letter-spacing:.08em;text-transform:none}.card-info .card-link{color:#f1eee7;text-decoration:none;transition:color .2s ease}.card-info .card-link:hover{color:#ff5b1a}
	@media(max-width:760px){.business-card{width:100%;aspect-ratio:1.5}.card-face{padding:20px}.card-face::after{inset:9px}.card-brand{gap:10px}.card-brand .card-mark{width:45px}.card-brand b{font-size:clamp(2.8rem,14vw,4.6rem)}.card-brand small{margin-top:10px;font-size:8px;letter-spacing:.22em}.card-topline,.card-bottomline{font-size:8px;letter-spacing:.08em}.card-bottomline{align-items:flex-end}.card-bottomline i{font-size:9px}.card-info{gap:5px;margin:14px 0 16px;font-size:9px}}

	/* Give the reel room to breathe vertically and leave a clear landing area
	   after the final frame. */
	.work-reel{padding-block:clamp(12vh,14vh,18vh)}
	.reel-track{padding-right:0}
	@media(max-width:760px){
		.work-reel{padding-block:clamp(96px,14vh,150px) clamp(80px,11vh,120px)}
		.reel-track{
			padding:clamp(18px,4vh,38px) clamp(18px,5vw,36px) clamp(54px,8vh,88px);
			padding-right:0;
			scroll-padding-inline:18px;
			scroll-behavior:smooth;
			overflow-x:auto;
			overflow-y:visible;
			overscroll-behavior-x:contain;
		}
	}

	.hero{min-height:100vh;display:grid;grid-template-columns:minmax(280px,.85fr) minmax(0,1.15fr);align-items:center;gap:clamp(5vw,9vw,12vw);padding:clamp(8vh,13vh,18vh) 7vw}
	.hero-copy-wrap{align-self:center;position:relative;z-index:2;padding:0;display:flex;flex-direction:column;align-items:flex-start}
	.hero-identity{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;align-items:center;column-gap:clamp(16px,2vw,30px);margin:0}
	.hero-mark{grid-row:1 / span 2;width:clamp(70px,9vw,128px);height:auto;overflow:visible}
	.hero-mark .cloud{fill:#f1eee7}
	.hero-mark .drop{stroke:#ff5b1a;stroke-width:2.2;stroke-linecap:round;animation:pour 1.1s linear infinite;transform-origin:center}
	.hero-mark .drop:nth-child(2){animation-delay:.2s}
	.hero-mark .drop:nth-child(3){animation-delay:.45s}
	.hero-name{margin:0;font-size:clamp(5rem,10vw,11rem);font-weight:600;letter-spacing:-.1em;line-height:.78;text-transform:uppercase}
	.hero-name span{color:#ff5b1a}
	.hero-role{grid-column:2;margin:8px 0 0;padding:0 0 0 clamp(8px,.7vw,12px);color:#ff5b1a;font:12px 'DM Mono',monospace;letter-spacing:.16em;text-transform:uppercase}
	.hero-portrait{position:relative;top:auto;right:auto;width:100%;height:min(72vh,760px);min-height:520px;align-self:center;clip-path:none;transform:none;border-radius:2px}
	.hero-portrait:after{background:linear-gradient(180deg,transparent 65%,rgba(5,9,9,.25))}
	.hero-slide img{height:108%;object-position:center;filter:saturate(.9) contrast(1.02)}
	.rain-break{display:none}
	@media(max-width:760px){
		.hero{display:flex;flex-direction:column;align-items:stretch;min-height:auto;gap:12vh;padding:14vh 7vw 16vh}
		.hero-identity{column-gap:14px}
		.hero-mark{width:58px}
		.hero-name{font-size:clamp(3.8rem,16vw,6rem)}
		.hero-role{font-size:10px;margin-top:22px}
		.hero-portrait{height:70vh;min-height:430px}
	}
	.reel-intro{will-change:opacity}

	/* Rain-inspired accent palette */
	:global(:root){--rain-accent:#4ca6d8;--rain-accent-deep:#2d6f98;--rain-accent-faint:rgba(76,166,216,.2)}
	.puddle{border-color:rgba(76,166,216,.2)}
	.puddle::before{border-color:rgba(76,166,216,.14)}
	.email span,.text-link span,nav a:hover,.text-link:hover,.eyebrow span,h2 em,.reel-hint span,.card-mark,.card-face i,.rain-mark:hover .cloud,.hero-role,.card-topline span:last-child,.card-bottomline span:last-child,.card-brand small,.business-card:hover .card-bottomline i,.card-info .card-link:hover,.hero-name span{color:var(--rain-accent)}
	.view-arrow{background:var(--rain-accent)}
	.contact .eyebrow{color:var(--rain-accent-deep)}
	.contact h2 em{color:#fff}
	.contact-footer{color:var(--rain-accent-deep)}
	.rain-mark .drop,.card-brand .drop,.hero-mark .drop{stroke:var(--rain-accent)}
	.rain-break span{background:linear-gradient(180deg,transparent 0%,var(--rain-accent) 45%,transparent 100%)}
	.business-card:focus-visible{outline-color:var(--rain-accent)}
	.card-face::after{border-color:rgba(76,166,216,.45)}

	/* Puddles: a small number of GPU-friendly ripple emitters. Each ring only
	   animates opacity and transform, so the loop does not trigger layout. */
	.contact-puddles{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none}
	.contact > .section-top,.contact > .contact-layout,.contact > .contact-footer{position:relative;z-index:2}
	.contact-puddles .puddle{opacity:1;animation:none;transform:rotate(-8deg);aspect-ratio:1.55;border:0;background:repeating-radial-gradient(ellipse at center,transparent 0 17%,rgba(17,24,23,.18) 18% 18.6%,transparent 19.6% 29%);contain:layout paint;isolation:isolate}
	.contact-puddles .puddle::before{display:none}
	.contact-puddles .puddle i{position:absolute;inset:0;display:block;border:2px solid rgba(17,24,23,.34);border-radius:50%;opacity:0;transform:scale(.08,.08);transform-origin:center;animation:puddle-ripple 10s cubic-bezier(.2,.45,.25,1) infinite;will-change:transform,opacity}
	.contact-puddles .puddle i:nth-child(2){animation-delay:-2s}
	.contact-puddles .puddle i:nth-child(3){animation-delay:-4s}
	.contact-puddles .puddle i:nth-child(4){animation-delay:-6s}
	.contact-puddles .puddle i:nth-child(5){animation-delay:-8s}
	.contact-puddles .puddle i:nth-child(even){border-color:rgba(17,24,23,.2);border-width:2px}
	.contact-puddles .puddle-b{transform:rotate(9deg)}
	.contact-puddles .puddle-c{transform:rotate(-4deg)}
	.contact-puddles .puddle-d{transform:rotate(13deg)}
	@keyframes puddle-ripple{0%{opacity:.04;transform:scale(.08,.08)}8%{opacity:.68}28%{opacity:.32}72%{opacity:.1}100%{opacity:0;transform:scale(1.12,1.12)}}
	@media(prefers-reduced-motion:reduce){.contact-puddles .puddle i{animation:none}.contact-puddles .puddle i:first-child{opacity:.18;transform:scale(1)}}

	/* Contact side: keep the back focused on the two ways to reach Zac, with
	   enough contrast and movement to feel like part of the visual identity. */
	.card-back{isolation:isolate;padding:clamp(22px,4vw,46px);background:#071316;color:#f1eee7}
	.card-back::before{background:linear-gradient(125deg,rgba(4,12,14,.9) 0%,rgba(4,12,14,.5) 52%,rgba(76,166,216,.2) 100%),var(--card-bg);background-position:center;background-size:cover;filter:saturate(1.25) contrast(1.12);transform:scale(1.06)}
	.card-back::after{inset:13px;border-color:rgba(76,166,216,.72);clip-path:polygon(0 0,100% 0,100% 82%,92% 100%,0 100%)}
	.back-content{position:relative;z-index:1;display:flex;align-items:stretch;justify-content:center;flex:1;margin:0;padding:clamp(8px,1.5vw,18px) 0}
	.back-content::before{content:'';position:absolute;inset:4% 10% 4% -8%;border:1px solid rgba(76,166,216,.34);clip-path:polygon(0 0,100% 0,89% 100%,0 100%);pointer-events:none}
	.card-back .card-info{position:relative;display:grid;grid-template-columns:1.18fr .82fr;align-items:stretch;width:100%;min-height:100%;gap:0;margin:0;padding:0;font:10px 'DM Mono',monospace;letter-spacing:.03em}
	.card-back .card-info::before{content:'';position:absolute;left:58%;top:7%;bottom:7%;width:1px;background:linear-gradient(180deg,transparent,var(--rain-accent) 18%,var(--rain-accent) 82%,transparent);opacity:.72;transform:skew(-12deg);pointer-events:none}
	.card-back .card-info .card-link{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:12px;min-width:0;padding:clamp(14px,2.4vw,30px) clamp(13px,2.8vw,38px);border:0;color:#f1eee7;text-decoration:none;transition:transform .3s ease,background .3s ease,color .3s ease}
	.card-back .card-info .card-link:first-child{background:linear-gradient(108deg,rgba(76,166,216,.13),transparent 72%);}
	.card-back .card-info .card-link:first-child::before{content:'';position:absolute;left:0;top:18%;width:4px;height:64%;background:var(--rain-accent);box-shadow:0 0 18px rgba(76,166,216,.7)}
	.card-back .card-info .card-link:last-child{padding-left:clamp(20px,3.5vw,48px);background:linear-gradient(108deg,rgba(4,12,14,.12),rgba(76,166,216,.1));}
	.card-back .card-info .card-link:hover{background:rgba(76,166,216,.18);color:#fff;transform:translateY(-4px)}
	.card-back .card-info .card-link:focus-visible{outline:1px solid var(--rain-accent);outline-offset:-5px}
	.card-back .card-info small{color:var(--rain-accent);font-size:9px;letter-spacing:.22em;line-height:1}
	.card-back .card-info span{max-width:100%;overflow-wrap:anywhere;text-align:left;line-height:1.08;letter-spacing:.01em}
	.card-back .card-info .card-link:first-child span{font-size:clamp(15px,2.55vw,27px);letter-spacing:.055em;white-space:nowrap}
	.card-back .card-info .card-link:last-child span{font-size:clamp(11px,1.4vw,16px);line-height:1.25}
	@media(max-width:760px){
		.card-back::after{inset:9px}
		.back-content{padding:4px 0}
		.back-content::before{inset:3% 2% 3% -5%}
		.card-back .card-info{grid-template-columns:1fr;gap:10px}
		.card-back .card-info::before{left:7%;right:7%;top:50%;bottom:auto;width:auto;height:1px;transform:none;background:linear-gradient(90deg,transparent,var(--rain-accent),transparent)}
		.card-back .card-info .card-link,.card-back .card-info .card-link:last-child{padding:14px 14px 14px 22px;gap:8px}
		.card-back .card-info small{font-size:8px}
		.card-back .card-info .card-link:first-child span{font-size:clamp(17px,5vw,24px)}
		.card-back .card-info .card-link:last-child span{font-size:clamp(11px,3.1vw,14px)}
	}
	/* About section: let the introduction land before the supporting story. */
	.about{min-height:155vh;padding-bottom:8vh}
	.about-layout{grid-template-columns:minmax(260px,.72fr) minmax(0,1.28fr);column-gap:8vw;row-gap:clamp(10vh,15vh,22vh);align-items:start;margin-top:clamp(12vh,17vh,24vh)}
	.about-heading{grid-column:1 / -1}
	.about h2{font-size:clamp(6rem,13vw,14rem)}
	.about-portrait{width:min(100%,390px);max-width:none}
	.about-text{max-width:560px;padding:clamp(5vh,8vh,12vh) 0 2vh}
	.large-copy{font-size:clamp(1.8rem,3vw,3.25rem);margin-bottom:36px}
	.about-text>p:not(.large-copy){font-size:15px;line-height:1.75;max-width:520px}
	.facts{margin:42px 0}
	.about-marquee{margin-top:30vh;margin-bottom:14vh}
	@media(max-width:760px){
		.about{min-height:auto;padding-bottom:0}
		.about-layout{display:block;margin-top:90px}
		.about-heading{margin-bottom:22vh}
		.about h2{font-size:clamp(4.8rem,20vw,7rem)}
		.about-portrait{width:70%;max-width:none;margin:0 0 45px auto}
		.about-text{padding:0}
		.about-marquee{margin-top:18vh;margin-bottom:12vh}
	}

	/* The duplicated phrases make the loop seamless; the mask lets them dissolve
	   into the section background as they leave either edge. */
	.about-marquee{
		width:calc(100% + 18vw);
		margin-left:-9vw;
		overflow:hidden;
		transform:none;
		color:#111717;
		opacity:.1;
		-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 10%,#000 90%,transparent 100%);
		mask-image:linear-gradient(90deg,transparent 0%,#000 10%,#000 90%,transparent 100%);
	}
	.about-marquee span:last-child{color:inherit}
	.about-marquee b{color:var(--rain-accent);opacity:.82;font-weight:inherit}
	.about-marquee-track{
		display:flex;
		flex:0 0 auto;
		gap:30px;
		will-change:transform;
		animation:about-marquee-scroll 68s linear infinite;
	}
	@keyframes about-marquee-scroll{
		from{transform:translate3d(0,0,0)}
		to{transform:translate3d(calc(-100% - 30px),0,0)}
	}
	@media(max-width:760px){.about-marquee{width:calc(100% + 36px);margin-left:-18px}}
	@media(prefers-reduced-motion:reduce){.about-marquee-track{animation:none;transform:none}}

	/* Contact finish: a single clean blue field with restrained aerial ripples. */
	.contact{background:#4ca6d8;color:#0b1b24}
	.contact-glow{display:none}
	.contact-puddles{z-index:0}
	.contact > .section-top,.contact > .contact-layout,.contact > .contact-footer{z-index:1}
	.contact-puddles .puddle{
		width:clamp(190px,23vw,390px);
		aspect-ratio:1;
		border:0;
		border-radius:50%;
		background:transparent;
		opacity:.82;
		transform:none;
		animation:none;
		contain:layout paint;
		isolation:isolate;
	}
	.contact-puddles .puddle::before{
		display:block;
		content:'';
		position:absolute;
		inset:calc(50% - 3px);
		width:6px;
		height:6px;
		border:0;
		border-radius:50%;
		background:rgba(255,255,255,.55);
		box-shadow:none;
		animation:drop-point 9s ease-out infinite;
		will-change:transform,opacity;
	}
	.contact-puddles .puddle::after{
		display:none;
	}
	.contact-puddles .puddle i{
		display:none;
	}
	.contact-puddles .puddle i:first-child{
		position:absolute;
		inset:0;
		display:block;
		border:8px solid rgba(10,73,118,.82);
		border-radius:50%;
		opacity:0;
		transform:scale(.04);
		transform-origin:center;
		animation:soft-ripple 9s cubic-bezier(.18,.56,.25,1) infinite;
		will-change:transform,opacity;
		filter:none;
	}
	.contact-puddles .puddle-b{top:34%;right:5%;width:clamp(250px,31vw,530px);transform:none}
	.contact-puddles .puddle-c{bottom:-1%;left:35%;width:clamp(220px,27vw,460px);transform:none}
	.contact-puddles .puddle-d{top:58%;left:-4%;width:clamp(150px,18vw,300px);transform:none}
	.contact-puddles .puddle-b i:first-child,.contact-puddles .puddle-b::before{animation-delay:-4.5s}
	.contact-puddles .puddle-c i:first-child,.contact-puddles .puddle-c::before{animation-delay:-2.7s}
	.contact-puddles .puddle-d i:first-child,.contact-puddles .puddle-d::before{animation-delay:-6.6s}
	.work-puddles{
		z-index:1;
		opacity:0;
		mix-blend-mode:normal;
	}
	.work-reel > .reel-intro,.work-reel > .reel-track{position:relative;z-index:2}
	.work-reel > .reel-track{will-change:transform}
	.work-puddles .puddle{opacity:1}
	.work-puddles .puddle{width:clamp(280px,32vw,620px)}
	.work-puddles .puddle::before{background:#e6f8ff}
	.work-puddles .puddle i:first-child{border:2px solid #8bdcff;animation-name:work-ripple;filter:none}
	@keyframes work-ripple{
		0%{opacity:0;transform:scale(.04)}
		6%{opacity:.55}
		14%{opacity:1}
		38%{opacity:.72}
		68%{opacity:.3}
		100%{opacity:0;transform:scale(1.08)}
	}
	@keyframes drop-point{
		0%{opacity:.64;transform:scale(.4)}
		8%{opacity:.5;transform:scale(1)}
		20%,100%{opacity:0;transform:scale(1.2)}
	}
	@keyframes soft-ripple{
		0%{opacity:0;transform:scale(.04)}
		6%{opacity:.5}
		14%{opacity:.94}
		38%{opacity:.7}
		68%{opacity:.28}
		100%{opacity:0;transform:scale(1.08)}
	}
	@media(prefers-reduced-motion:reduce){.contact-puddles .puddle i:first-child,.contact-puddles .puddle::before{animation:none}.contact-puddles .puddle i:first-child{opacity:.32;transform:scale(1)}}
	@media(max-width:760px){
		.contact{background:#4ca6d8}
		.contact-puddles .puddle{width:clamp(180px,64vw,300px)}
		.contact-puddles .puddle-b{top:31%;right:-20%;width:clamp(260px,88vw,430px)}
		.contact-puddles .puddle-c{bottom:6%;left:28%;width:clamp(210px,72vw,350px)}
		.contact-puddles .puddle-d{top:57%;left:-30%;width:clamp(175px,60vw,280px)}
	}
	/* Vertical scroll depth layers */
	.hero-portrait,.about h2,.about-portrait img,.large-copy,.contact-glow,.contact h2{will-change:transform}
	.about-portrait img{height:130%;margin-top:-15%}
	@media(prefers-reduced-motion:reduce){.hero-portrait,.about h2,.about-portrait img,.large-copy,.contact-glow,.contact h2{will-change:auto}}
	/* Let the horizontal reel follow the user's scroll position without snapping. */
	@media(max-width:760px){.reel-track{scroll-snap-type:none}.reel-card,.reel-card.hero-card{scroll-snap-align:none;scroll-snap-stop:normal}}

	/* Final responsive pass: these rules intentionally live last so the tablet and
	   phone layouts are not overridden by the older desktop experiments above. */
	:global(html){overflow-x:hidden}
	:global(body){min-width:320px}
	.section-top{gap:20px}
	.section-index{white-space:nowrap}
	.reel-track{-webkit-overflow-scrolling:touch;scrollbar-width:none}
	.reel-track::-webkit-scrollbar{display:none}
	.reel-card,.reel-card.hero-card{flex:0 0 auto}

	@media(min-width:761px) and (max-width:1100px){
		.hero{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(24px,5vw,64px);padding:clamp(72px,10vh,112px) clamp(28px,7vw,72px);min-height:100vh}
		.hero-identity{column-gap:clamp(12px,1.8vw,24px)}
		.hero-mark{width:clamp(64px,8vw,96px)}
		.hero-name{font-size:clamp(4.35rem,9vw,7.3rem)}
		.hero-role{font-size:11px}
		.hero-portrait{height:min(74vh,680px);min-height:440px}

		.about{padding:clamp(88px,11vh,128px) clamp(28px,7vw,72px) 48px;min-height:auto}
		.about-layout{margin-top:clamp(80px,11vh,132px);column-gap:clamp(28px,6vw,72px);row-gap:clamp(72px,12vh,132px)}
		.about h2{font-size:clamp(5rem,11vw,8.5rem)}
		.about-portrait{width:min(100%,340px)}
		.about-text{max-width:460px;padding:0}
		.large-copy{font-size:clamp(1.8rem,3vw,2.8rem)}
		.about-text>p:not(.large-copy){font-size:14px;line-height:1.7}
		.about-marquee{margin-top:clamp(140px,20vh,240px);margin-bottom:80px}

		.work-reel{gap:clamp(32px,5vw,64px);padding-block:clamp(96px,13vh,150px)}
		.reel-intro{flex-basis:clamp(250px,29vw,320px);padding-left:clamp(28px,7vw,72px)}
		.reel-intro h2{font-size:clamp(4rem,7.2vw,6.6rem);margin-block:clamp(52px,8vh,84px) 42px}
		.reel-track{gap:clamp(18px,2.6vw,28px);padding-right:clamp(32px,7vw,72px)}
		.reel-card{width:clamp(260px,27vw,320px);min-width:clamp(260px,27vw,320px)}
		.reel-card.hero-card{width:clamp(310px,33vw,380px);min-width:clamp(310px,33vw,380px)}

		.contact{padding:clamp(88px,11vh,128px) clamp(28px,7vw,72px) 42px;min-height:100vh}
		.contact-layout{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,5vw,64px);margin-top:clamp(90px,12vh,140px)}
		.contact h2{font-size:clamp(4.5rem,8.2vw,7.8rem);margin-bottom:42px}
		.business-card{width:100%;max-width:520px}
		.contact-footer{left:clamp(28px,7vw,72px);right:clamp(28px,7vw,72px)}
	}

	@media(max-width:760px){
		.section-top{align-items:flex-start;gap:12px}
		.eyebrow,.section-index{font-size:9px;line-height:1.4}
		.eyebrow span{margin-right:10px}

		.hero{padding:clamp(82px,14vh,120px) clamp(18px,7vw,28px) clamp(92px,16vh,144px);gap:clamp(60px,12vh,112px)}
		.hero-identity{column-gap:10px}
		.hero-mark{width:clamp(48px,14vw,58px)}
		.hero-name{font-size:clamp(3.35rem,15.5vw,5.8rem);line-height:.8}
		.hero-role{font-size:9px;letter-spacing:.12em;margin-top:16px;padding-left:4px}
		.hero-portrait{height:clamp(360px,68vh,580px);min-height:0;width:100%}

		.about{padding:clamp(72px,10vh,96px) clamp(18px,7vw,28px) 0;min-height:auto}
		.about-layout{margin-top:clamp(64px,10vh,88px)}
		.about-heading{margin-bottom:clamp(84px,16vh,142px)}
		.about h2{font-size:clamp(4.25rem,18vw,6.5rem);line-height:.82}
		.about-portrait{width:min(86%,360px);margin:0 auto 48px}
		.about-text{max-width:100%;padding:0}
		.large-copy{font-size:clamp(1.65rem,7vw,2.25rem);line-height:1.05;margin-bottom:26px}
		.about-text>p:not(.large-copy){font-size:14px;line-height:1.7}
		.facts{gap:6px;margin:28px 0}
		.facts span{padding:7px 9px;font-size:9px}
		.about-marquee{margin-top:clamp(112px,18vh,170px);margin-bottom:clamp(76px,12vh,112px)}

		.work-reel{display:block;min-height:auto;padding-block:clamp(88px,13vh,132px) clamp(72px,11vh,108px)}
		.reel-intro{padding-inline:clamp(18px,7vw,28px)}
		.reel-intro h2{font-size:clamp(3.8rem,16vw,5.9rem);line-height:.82;margin:clamp(48px,8vh,68px) 0 32px}
		.reel-hint{line-height:1.7}
		.reel-track{width:auto;gap:14px;padding:clamp(18px,4vh,30px) clamp(18px,7vw,28px) 44px;overflow-x:auto;overflow-y:visible}
		.reel-card,.reel-card.hero-card{width:min(78vw,320px);min-width:min(78vw,320px);margin:0}
		.reel-meta{font-size:9px;gap:8px;padding-top:12px;line-height:1.35}
		.reel-meta strong{max-width:62%}

		.contact{min-height:900px;padding:clamp(72px,10vh,96px) clamp(18px,7vw,28px) 32px}
		.contact-layout{display:block;margin-top:clamp(76px,12vh,108px)}
		.contact h2{font-size:clamp(4rem,17vw,6.2rem);line-height:.82;margin-bottom:36px}
		.email{display:block;width:fit-content;max-width:100%;padding-bottom:10px;font-size:clamp(.95rem,4.7vw,1.25rem);overflow-wrap:anywhere}
		.business-card{width:100%;aspect-ratio:1.55;margin-top:clamp(72px,12vh,104px)}
		.card-face{padding:clamp(16px,5vw,22px)}
		.card-face::after{inset:9px}
		.card-brand{gap:9px}
		.card-brand .card-mark{width:clamp(40px,12vw,50px)}
		.card-brand b{font-size:clamp(2.6rem,13vw,4.5rem)}
		.card-brand small{font-size:8px;letter-spacing:.2em;margin-top:9px}
		.card-topline,.card-bottomline{font-size:7px;letter-spacing:.06em;gap:10px}
		.card-bottomline{align-items:flex-end}
		.card-bottomline i{font-size:8px;text-align:right}
		.contact-footer{position:static;margin-top:clamp(64px,10vh,92px);padding-bottom:4px;display:grid;grid-template-columns:1fr auto;gap:14px 18px}
		.contact-footer span:first-child{grid-column:1 / -1}
		.contact-footer span:nth-child(2){display:block;grid-column:1}
		.contact-footer a{grid-column:2;grid-row:2;align-self:end;text-align:right}
	}

	@media(max-width:360px){
		.hero-name{font-size:3.2rem}
		.hero-mark{width:45px}
		.about h2{font-size:4.05rem}
		.reel-card,.reel-card.hero-card{width:78vw;min-width:78vw}
		.card-topline,.card-bottomline{font-size:6.5px}
	}

	/* A quiet veil of rain behind the about story. The SVGs share one path,
	   while their seeded variables keep the field varied and hydration-safe. */
	.about-rain{
		position:absolute;
		inset:0;
		z-index:0;
		overflow:hidden;
		pointer-events:none;
		opacity:.58;
		contain:paint;
	}
	.about > .section-top,.about > .about-layout,.about > .about-marquee{
		position:relative;
		z-index:1;
	}
	.about-rain__drop{
		position:absolute;
		left:calc(var(--x) * 1%);
		top:calc(var(--y) * 1% - 18vh);
		width:clamp(2px,.28vw,4px);
		height:clamp(22px,4vh,42px);
		animation:about-rain-fall calc(var(--a) * 1s) linear calc(var(--d) * 1s) infinite;
		will-change:transform,opacity;
	}
	.about-rain__drop path{
		fill:rgba(76,166,216,.95);
		opacity:var(--o);
		transform:scaleY(var(--s));
		transform-origin:top center;
	}
	@keyframes about-rain-fall{
		0%{opacity:0;transform:translate3d(0,0,0)}
		12%{opacity:1}
		88%{opacity:1;transform:translate3d(-1.2vw,105vh,0)}
		100%{opacity:0;transform:translate3d(-1.4vw,115vh,0)}
	}
	@media(max-width:760px){
		.about-rain{opacity:.48}
		.about-rain__drop{width:2px;height:clamp(18px,3.4vh,30px)}
	}
	@media(prefers-reduced-motion:reduce){
		.about-rain__drop{animation:none}
	}

	/* Pointer depth for the contact card. The outer tilt leaves the existing
	   front/back flip transforms untouched, while the layers drift at different
	   speeds to create a small parallax effect. */
	.business-card{
		--card-tilt-x:0deg;
		--card-tilt-y:0deg;
		--card-shift-x:0px;
		--card-shift-y:0px;
		--card-glare-x:50%;
		--card-glare-y:50%;
		transform:perspective(1600px) rotateX(var(--card-tilt-y)) rotateY(var(--card-tilt-x)) translateZ(var(--card-lift,0px));
		transform-style:preserve-3d;
		transition:transform .2s cubic-bezier(.2,.75,.2,1),filter .35s ease;
		will-change:transform;
		touch-action:manipulation;
	}
	.business-card:hover{--card-lift:4px;filter:drop-shadow(0 34px 38px rgba(0,0,0,.32))}
	.card-face::before{transform:translate3d(calc(var(--card-shift-x) * -0.55),calc(var(--card-shift-y) * -0.55),0) scale(1.04)}
	.business-card:hover .card-face::before{transform:translate3d(calc(var(--card-shift-x) * -0.55),calc(var(--card-shift-y) * -0.55),0) scale(1.09)}
	.card-face::after{background:radial-gradient(circle at var(--card-glare-x) var(--card-glare-y),rgba(255,255,255,.16),transparent 36%)}
	.card-face > *{transform:translate3d(calc(var(--card-shift-x) * .25),calc(var(--card-shift-y) * .25),0);transition:transform .2s ease-out}
	@media(prefers-reduced-motion:reduce){.business-card{transform:none;transition:none;will-change:auto}.card-face::before,.business-card:hover .card-face::before,.card-face > *{transform:none;transition:none}}
	:global(.low-power) .work-puddles,
	:global(.low-power) .about-rain,
	:global(.low-power) .storm-rain,
	:global(.low-power) .storm-flash{display:none!important}
	:global(.low-power) .reel-photo img{transition:none;filter:none}
	:global(.low-power) .reel-track{will-change:transform}
	:global(.low-power) .business-card{will-change:auto;transition:none;filter:none}
	</style>

<script>
	import { onMount } from 'svelte';
	import LensLogo from '$lib/LensLogo.svelte';

	const siteUrl = 'https://rainsphotography.com';
	const pageUrl = `${siteUrl}/`;
	const shareImage = `${siteUrl}/775127040_1032669189502473_4919640403744633589_n.jpg`;
	const pageTitle = 'Zac Rains Photography — Honest photographs for the good stuff';
	const pageDescription = 'Zac Rains is a Wisconsin photographer making honest photographs of people, places, details, weddings, families, and the moments worth keeping.';

	/** @param {string} filename */
	const asset = (filename) => `/${filename.split('/').map(encodeURIComponent).join('/')}`;
	const portrait = asset('707453577_17965332306081022_639360383094076295_n.jpg');
	/** @type {Array<[string, string]>} */
	let heroSlides = [
		['newer/optimized/Fuller -051.jpg', 'Winter bride'],
		['newer/optimized/Fuller -024.jpg', 'The groomsmen'],
		['newer/optimized/DSC_9880.jpg', 'At the coffee bar'],
		['newer/optimized/DSC_9986-2.jpg', 'Hands at work'],
		['newer/optimized/DSC_0246.jpg', 'A room with a story'],
		['newer/optimized/DSC_0232.jpg', 'Jewelry in focus'],
		['newer/optimized/Fuller -116.jpg', 'The bridal party'],
		['newer/optimized/DSC_0132.jpg', 'The pour'],
		['newer/optimized/Fuller -001.jpg', 'Wedding details'],
		['newer/optimized/D7B805B9-7968-4B1C-B69A-32EA8EFD1393-Topaz-Gigapixel-4X-2.jpg', 'Zac Rains']
	];
	/** @param {Array<[string, string]>} slides @returns {Array<[string, string]>} */
	const shuffleSlides = (slides) => {
		const shuffled = [...slides];
		for (let index = shuffled.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
		}
		return shuffled;
	};
	// Curated from the compressed newer set so the gallery loads quickly without
	// asking the browser to decode the full-resolution archive files.
	const reel = [
		['newer/optimized/Fuller -051.jpg', '01 / Winter bride', 'weddings / wisconsin'],
		['newer/optimized/Fuller -024.jpg', '02 / The groomsmen', 'people / 2025'],
		['newer/optimized/Fuller -041.jpg', '03 / Getting ready', 'weddings / 2025'],
		['newer/optimized/DSC_9880.jpg', '04 / At the coffee bar', 'documentary / people'],
		['newer/optimized/DSC_9986-2.jpg', '05 / Hands at work', 'craft / black and white'],
		['newer/optimized/DSC_9956.jpg', '06 / The workbench', 'detail / studio'],
		['newer/optimized/DSC_0246.jpg', '07 / A room with a story', 'places / interiors'],
		['newer/optimized/DSC_0232.jpg', '08 / Jewelry in focus', 'product / detail'],
		['newer/optimized/DSC_0132.jpg', '09 / The pour', 'food / process'],
		['newer/optimized/Fuller -116.jpg', '10 / The bridal party', 'weddings / 2025'],
		['newer/optimized/Fuller -002.jpg', '11 / Wedding details', 'details / weddings'],
		['newer/optimized/Fuller -001.jpg', '12 / Before the vows', 'details / weddings'],
		['newer/optimized/D7B805B9-7968-4B1C-B69A-32EA8EFD1393-Topaz-Gigapixel-4X-2.jpg', '13 / The photographer', 'portrait / zac rains']
	];
	let cardFlipped = false;
	let cardFlipping = false;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let cardFlipTimer;
	const cardBg = asset('card-background.jpg');
	/** @type {{frame: number, bounds: DOMRect | null, x: number, y: number}} */
	const cardMotion = { frame: 0, bounds: null, x: 0, y: 0 };

	const flipCard = () => {
		cardFlipped = !cardFlipped;
		cardFlipping = false;
		clearTimeout(cardFlipTimer);
		requestAnimationFrame(() => {
			cardFlipping = true;
			cardFlipTimer = setTimeout(() => (cardFlipping = false), 900);
		});
	};
	
	/** @param {PointerEvent} event */
	const handleCardPointerMove = (event) => {
		if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('low-power')) return;
		const card = event.currentTarget;
		if (!(card instanceof HTMLElement)) return;
		const bounds = cardMotion.bounds || card.getBoundingClientRect();
		cardMotion.bounds = bounds;
		cardMotion.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
		cardMotion.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
		if (cardMotion.frame) return;
		cardMotion.frame = requestAnimationFrame(() => {
			cardMotion.frame = 0;
			const { x, y } = cardMotion;
			card.style.setProperty('--card-tilt-x', `${(x - 0.5) * 6}deg`);
			card.style.setProperty('--card-tilt-y', `${(0.5 - y) * 5}deg`);
			card.style.setProperty('--card-shift-x', `${(x - 0.5) * 12}px`);
			card.style.setProperty('--card-shift-y', `${(y - 0.5) * 10}px`);
			card.style.setProperty('--card-glare-x', `${x * 100}%`);
			card.style.setProperty('--card-glare-y', `${y * 100}%`);
		});
	};

	/** @param {PointerEvent} event */
	const resetCardPointer = (event) => {
		const card = event.currentTarget;
		if (!(card instanceof HTMLElement)) return;
		if (cardMotion.frame) cancelAnimationFrame(cardMotion.frame);
		cardMotion.frame = 0;
		cardMotion.bounds = null;
		card.style.removeProperty('--card-tilt-x');
		card.style.removeProperty('--card-tilt-y');
		card.style.removeProperty('--card-shift-x');
		card.style.removeProperty('--card-shift-y');
		card.style.removeProperty('--card-glare-x');
		card.style.removeProperty('--card-glare-y');
	};
	onMount(() => {
		/** @type {(() => void) | undefined} */
		let cleanup;
		let destroyed = false;
		heroSlides = shuffleSlides(heroSlides);

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
		/** @type {import('gsap/ScrollTrigger').ScrollTrigger | null} */
		let workScrollTrigger = null;
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
			// Give the title only a brief settling beat before the reel responds.
			// A long hold here makes normal wheel/trackpad input feel stuck.
			const introPause = () => window.innerHeight * 0.18;
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
				scrub: 0.35,
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
						const warmAccent = gsap.utils.interpolate('#ff5b1a', '#c74e18', colorProgress);
						setKeepColor(warmAccent);
					}
				}
			};
			refreshFadeBounds();
			const reelTimeline = gsap.timeline({ scrollTrigger: reelScrollTrigger });
			workScrollTrigger = reelTimeline.scrollTrigger ?? null;
			reelTimeline.to({}, { duration: () => introPause() / Math.max(1, distance()) })
				.to(reelTrack, { x: () => -distance(), duration: 1, ease: 'none', force3D: true });
		}
		if (ambientBackground) {
			const setBackground = gsap.quickSetter(ambientBackground, 'backgroundColor');
			const hero = document.querySelector('.hero');
			const about = document.querySelector('.about');
			const work = document.querySelector('.work-reel');
			const contact = document.querySelector('.contact');
			/** @param {string} from @param {string} to @param {number} amount */
			const colorAt = (from, to, amount) => gsap.utils.interpolate(from, to, Math.min(1, Math.max(0, amount)));
			/** @param {Element | null} element */
			const documentTop = (element) => element ? element.getBoundingClientRect().top + window.scrollY : 0;
			const backgroundTrigger = ScrollTrigger.create({
				trigger: '.shell',
				start: 'top top',
				end: 'bottom bottom',
				invalidateOnRefresh: true,
				onUpdate: () => {
					const scrollY = window.scrollY;
					const aboutTop = about ? documentTop(about) : 0;
					const workTop = work ? documentTop(work) : aboutTop;
					const workStart = workScrollTrigger?.start ?? workTop;
					const workEnd = workScrollTrigger?.end ?? workTop;
					const transitionDistance = Math.max(180, window.innerHeight * 0.42);
					const heroTransitionStart = Math.max(0, aboutTop - Math.max(180, window.innerHeight * 0.34));
					let color = '#0a0e0e';

					if (compactLayout) {
						const probe = scrollY + window.innerHeight * 0.22;
						const lead = Math.min(window.innerHeight * 0.36, 240);
						const points = [hero, about, work, contact].filter(Boolean);
						const colors = ['#0a0e0e', '#edf0e8', '#0a0e0e', '#e8dfd5'];
						color = colors[0];
						for (let index = 1; index < points.length; index += 1) {
							const top = documentTop(points[index]);
							const start = top - lead;
							const end = top + lead * 0.28;
							if (probe <= start) break;
							color = probe < end ? colorAt(colors[index - 1], colors[index], (probe - start) / (end - start)) : colors[index];
						}
					} else if (scrollY < heroTransitionStart) {
						color = '#0a0e0e';
					} else if (scrollY < aboutTop) {
						color = colorAt('#0a0e0e', '#edf0e8', (scrollY - heroTransitionStart) / (aboutTop - heroTransitionStart));
					} else if (scrollY < workTop - transitionDistance) {
						color = '#edf0e8';
					} else if (scrollY < workStart) {
						color = colorAt('#edf0e8', '#0a0e0e', (scrollY - (workTop - transitionDistance)) / transitionDistance);
					} else if (scrollY < workEnd) {
						const reelProgress = (scrollY - workStart) / Math.max(1, workEnd - workStart);
						color = colorAt('#0a0e0e', '#e8dfd5', (reelProgress - 0.72) / 0.26);
					} else {
						color = '#e8dfd5';
					}
					setBackground(color);
				}
			});
			backgroundTrigger.refresh();
			backgroundTrigger.update();
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
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="author" content="Zac Rains" />
	<meta name="keywords" content="Wisconsin photographer, wedding photographer, portrait photographer, family photographer, brand photographer, documentary photography, Zac Rains" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow" />
	<meta name="referrer" content="strict-origin-when-cross-origin" />
	<link rel="canonical" href={pageUrl} />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="alternate" hreflang="en" href={pageUrl} />

	<!-- Open Graph: used by Facebook, LinkedIn, Slack, iMessage, and other link previews. -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Zac Rains Photography" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:secure_url" content={shareImage} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1170" />
	<meta property="og:image:height" content="669" />
	<meta property="og:image:alt" content="Zac Rains Photography business card" />

	<!-- X/Twitter card metadata. -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content="Zac Rains Photography business card" />

	<!-- Schema.org helps search engines understand the person and local service. -->
	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'ProfessionalService',
			'@id': `${siteUrl}/#photographer`,
			name: 'Zac Rains Photography',
			url: pageUrl,
			image: shareImage,
			description: pageDescription,
			telephone: '+1-262-232-9332',
			email: 'astrozac@outlook.com',
			areaServed: ['Wisconsin', 'Worldwide'],
			serviceType: ['Wedding photography', 'Portrait photography', 'Family photography', 'Brand photography'],
			founder: { '@type': 'Person', name: 'Zac Rains' },
			priceRange: '$$'
		})}
	</script>
</svelte:head>

	<div class="shell">
		<div class="ambient-background" aria-hidden="true"></div>
		<a class="skip-link" href="#main-content">Skip to main content</a>
	<main id="main-content" tabindex="-1">
		<section class="hero chapter" id="top" aria-labelledby="hero-title">
			<div class="hero-copy-wrap">
				<div class="hero-identity" aria-label="Zac Rains, photographer">
					<span class="hero-mark"><LensLogo /></span>
					<h1 class="hero-name" id="hero-title">Zac <span>Rains</span></h1>
					<p class="hero-role">Photographer</p>
				</div>
			</div>
			<div class="hero-portrait" aria-label="Selected photography slideshow">{#each heroSlides as slide, i}<div class="hero-slide"><img src={asset(slide[0])} alt={slide[1]} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" /></div>{/each}</div>
		</section>

		<section class="about chapter" id="about" aria-label="About Zac Rains">
			<div class="section-top reveal"><p class="eyebrow"><span>02</span> The person behind the camera</p><span class="section-index">ABOUT / 2026</span></div>
			<div class="about-layout"><div class="about-heading reveal"><p class="side-note">A little<br />about me</p><h2>Hi, I'm<br /><em>Zac.</em></h2></div><div class="about-portrait reveal"><img src={portrait} alt="Zac Rains photographing his reflection in a mirror" /><span>THE GUY<br />BEHIND THE<br />LENS /</span></div><div class="about-text reveal"><p class="large-copy">Photographer, storyteller, and professional third wheel.</p><p>I make photographs with a sense of place and a little room to breathe. From Wisconsin weddings to the people and details that make a place memorable, I look for the honest frame that brings you back.</p><div class="facts"><span>Portraits</span><span>Weddings</span><span>Families</span><span>Brand stories</span></div></div></div>
			<div class="about-marquee" aria-hidden="true"><div class="about-marquee-track"><span><b>ZAC RAINS</b> / PEOPLE / PLACES / DETAILS / LIGHT / </span><span><b>ZAC RAINS</b> / PEOPLE / PLACES / DETAILS / LIGHT / </span></div><div class="about-marquee-track"><span><b>ZAC RAINS</b> / PEOPLE / PLACES / DETAILS / LIGHT / </span><span><b>ZAC RAINS</b> / PEOPLE / PLACES / DETAILS / LIGHT / </span></div></div>
		</section>

		<section class="work-reel chapter" id="work" aria-label="Selected work">
			<div class="reel-intro"><p class="eyebrow"><span>03</span> Selected work</p><h2>Frames<br /><em>worth<br />keeping.</em></h2><p class="reel-hint">Keep scrolling<br /><span>-></span></p></div>
			<div class="reel-track" role="region" aria-label="Selected work photo album">{#each reel as item, i}<div class:hero-card={i === 0} class="reel-card"><div class="reel-photo"><img src={asset(item[0])} alt={item[1]} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" /></div><div class="reel-meta"><strong>{item[1]}</strong><span>{item[2]}</span></div></div>{/each}</div>
		</section>

		<section class="contact chapter" id="contact" aria-label="Contact Zac Rains">
			<div class="section-top"><p class="eyebrow"><span>04</span> Make something real</p><span class="section-index">LET'S CONNECT</span></div>
			<div class="contact-layout"><div class="contact-details"><h2>Let's make<br /><em>something</em><br />real.</h2><a class="email" href="mailto:astrozac@outlook.com">astrozac@outlook.com <span>↗</span></a><a class="phone" href="tel:+12622329332">+1 262 232 9332</a><a class="download-card" href="/zac-rains-business-card-print.pdf" download><span class="download-arrow">↓</span><span>Business card</span></a></div><div class="business-card" class:flipped={cardFlipped} class:card-flipping={cardFlipping} onpointermove={handleCardPointerMove} onpointerleave={resetCardPointer} onclick={flipCard} onkeydown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); flipCard(); } }} role="button" tabindex="0" aria-label="Flip Zac Rains business card" aria-pressed={cardFlipped}>
				<span class="card-face card-front" style="--card-bg: url({cardBg})">
					<span class="card-brand">
						<span class="card-mark"><LensLogo delay="-2.15s" label="Zac Rains camera aperture logo. Click for another photography trick." /></span>
						<span><b>RAINS</b><small>PHOTOGRAPHY</small></span>
					</span>
				</span>
				<span class="card-face card-back" style="--card-bg: url({cardBg})">
					<span class="back-content">
						<span class="card-info">
							<a href="tel:262-232-9332" class="card-link"><small>CALL</small><span>262—232—9332</span></a>
							<a href="mailto:astrozac@outlook.com" class="card-link"><small>MAIL</small><span>astrozac@outlook.com</span></a>
						</span>
					</span>
				</span>
			</div><span class="card-flip-hint">Flip to connect →</span></div>
			<div class="contact-footer"><span>Copyright {new Date().getFullYear()} Zac Rains Photography</span><span>Good light, honestly seen.</span><a href="#top">Back to top ^</a></div>
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
	.business-card{position:relative;width:min(100%,620px);aspect-ratio:1.72;border:0;padding:0;background:transparent;cursor:pointer;perspective:1600px;text-align:left;color:#f1eee7}
	.business-card:focus-visible{outline:2px solid #ff5b1a;outline-offset:9px}
	.card-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;padding:clamp(22px,4vw,46px);border:1px solid rgba(255,255,255,.18);border-radius:2px;backface-visibility:hidden;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.2,.75,.2,1),box-shadow .9s ease}
	.card-face::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(8,11,12,.58) 0%,rgba(8,11,12,.22) 48%,rgba(8,11,12,.56) 100%),var(--card-bg);background-size:cover;background-position:center;z-index:-2;transform:scale(1.04);transition:transform 1.2s ease}
	.card-face::after{content:'';position:absolute;inset:14px;border:1px solid rgba(255,91,26,.45);pointer-events:none;z-index:-1}
	.card-front{transform:rotateY(0deg);box-shadow:inset 0 0 80px rgba(0,0,0,.28)}
	.card-back{transform:rotateY(180deg);background:#111817;color:#f1eee7;padding:0}
	.card-back::before{background:linear-gradient(115deg,rgba(8,11,12,.62),rgba(8,11,12,.26)),var(--card-bg);background-position:center}
	.business-card.flipped .card-front{transform:rotateY(-180deg)}
	.business-card.flipped .card-back{transform:rotateY(0deg)}
	.business-card:hover .card-face::before{transform:scale(1.09)}
	.card-topline,.card-bottomline{display:flex;justify-content:space-between;align-items:center;gap:20px;color:rgba(241,238,231,.68);font:10px 'DM Mono',monospace;letter-spacing:.13em;text-transform:uppercase}
	.card-topline span:last-child,.card-bottomline span:last-child{color:#ff5b1a}
	.card-brand{display:flex;align-items:center;gap:18px;margin-top:auto;margin-bottom:auto;margin-left:-12px}
	.card-brand .card-mark{display:block;width:clamp(74px,11vw,120px);height:auto;overflow:visible;flex:none}
	.card-brand .cloud{fill:#f1eee7}.card-brand .drop{stroke:#ff5b1a;stroke-width:2.2;stroke-linecap:round;animation:pour 1.1s linear infinite;transform-origin:center}.card-brand .drop:nth-child(2){animation-delay:.2s}.card-brand .drop:nth-child(3){animation-delay:.45s}
	.card-brand b{display:block;font-size:clamp(3.5rem,8vw,7.8rem);font-weight:600;line-height:.75;margin-left:-4px;letter-spacing:-.1em}.card-brand small{display:block;margin-top:4px;color:#ff5b1a;font:clamp(9px,1.2vw,13px) 'DM Mono',monospace;letter-spacing:.34em}
	.card-bottomline i{font:11px 'DM Mono',monospace;font-style:normal;letter-spacing:.08em;color:#f1eee7;transition:color .2s ease}.business-card:hover .card-bottomline i{color:#ff5b1a}
	.card-info{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin:22px 0 28px;font:clamp(10px,1.2vw,13px) 'DM Mono',monospace;letter-spacing:.08em;text-transform:none}.card-info .card-link{align-self:flex-start;width:fit-content;color:#f1eee7;text-decoration:none;transition:color .2s ease}.card-info .card-link:hover{color:#ff5b1a}
	@media(max-width:760px){.business-card{width:100%;aspect-ratio:1.5}.card-face{padding:20px}.card-face::after{inset:9px}.card-brand{gap:10px}.card-brand .card-mark{width:54px}.card-brand b{font-size:clamp(2.8rem,14vw,4.6rem)}.card-brand small{margin-top:10px;font-size:8px;letter-spacing:.22em}.card-topline,.card-bottomline{font-size:8px;letter-spacing:.08em}.card-bottomline{align-items:flex-end}.card-bottomline i{font-size:9px}.card-info{gap:5px;margin:14px 0 16px;font-size:9px}}

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
	.hero-mark{display:block;grid-row:1 / span 2;width:clamp(86px,10.5vw,148px);height:auto;overflow:visible}
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
		.hero-mark{width:68px}
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
	.card-back::before{background:linear-gradient(125deg,rgba(4,12,14,.9) 0%,rgba(4,12,14,.5) 52%,rgba(76,166,216,.2) 100%),var(--card-bg);background-position:center bottom;background-size:cover;filter:saturate(1.25) contrast(1.12);transform:scale(1.06)}
	.card-back::after{inset:13px;border-color:rgba(76,166,216,.72);clip-path:polygon(0 0,100% 0,100% 82%,92% 100%,0 100%)}
	.back-content{position:relative;z-index:1;display:flex;align-items:stretch;justify-content:center;flex:1;margin:0;padding:0}
	.back-content::before{content:'';position:absolute;inset:4% 10% 4% -8%;border:1px solid rgba(76,166,216,.34);clip-path:polygon(0 0,100% 0,89% 100%,0 100%);pointer-events:none}
	.card-back .card-info{position:relative;display:grid;grid-template-columns:1fr;align-items:start;width:100%;max-width:100%;min-height:0;gap:clamp(16px,2vw,24px);margin:auto;padding:clamp(14px,2vw,24px) clamp(13px,2.8vw,38px);font:10px 'DM Mono',monospace;letter-spacing:.03em}
	.card-back .card-info::before{content:'';position:absolute;left:7%;right:7%;top:50%;height:1px;background:linear-gradient(90deg,transparent,var(--rain-accent),transparent);opacity:.72;pointer-events:none}
	.card-back .card-info .card-link{position:relative;display:flex;align-self:start;justify-self:start;width:fit-content;max-width:100%;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;min-width:0;padding:0;border:0;background:transparent;color:#f1eee7;text-decoration:none;transition:transform .3s ease,color .3s ease}
	.card-back .card-info .card-link:first-child{background:transparent;}
	.card-back .card-info .card-link:first-child::before{display:none}
	.card-back .card-info .card-link:last-child{justify-self:start;padding-left:0;background:transparent;}
	.card-back .card-info .card-link:hover{background:transparent;color:#fff;transform:translateY(-4px)}
	.card-back .card-info .card-link:focus-visible{outline:1px solid var(--rain-accent);outline-offset:-5px}
	.card-back .card-info small{color:#ff9a6e;font-size:clamp(12px,1.15vw,15px);font-weight:600;letter-spacing:.22em;line-height:1}
	.card-back .card-info span{display:block;min-width:0;max-width:100%;overflow-wrap:anywhere;text-align:left;line-height:1.08;letter-spacing:.01em}
	.card-back .card-info .card-link:first-child span,.card-back .card-info .card-link:last-child span{font-size:clamp(20px,2.8vw,30px);letter-spacing:.04em;line-height:1.15;white-space:nowrap;overflow-wrap:normal}
	@media(max-width:760px){
		.card-back::after{inset:9px}
		.back-content{padding:0}
		.back-content::before{inset:3% 2% 3% -5%}
		.card-back .card-info{grid-template-columns:1fr;gap:10px;width:100%;max-width:100%}
		.card-back .card-info::before{left:7%;right:7%;top:50%;bottom:auto;width:auto;height:1px;transform:none;background:linear-gradient(90deg,transparent,var(--rain-accent),transparent)}
		.card-back .card-info .card-link,.card-back .card-info .card-link:last-child{align-self:start;justify-self:start;padding:0;gap:8px}
		.card-back .card-info small{font-size:8px}
		.card-back .card-info .card-link:first-child span,.card-back .card-info .card-link:last-child span{font-size:clamp(16px,5vw,24px)}
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
		.hero-mark{width:clamp(76px,9vw,112px)}
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
		.hero-mark{width:clamp(58px,16vw,70px)}
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
		.work-reel{background:transparent;color:#0b1b24;padding-block:clamp(56px,9vh,88px) clamp(64px,10vh,96px)}
		.reel-intro{padding-inline:clamp(18px,7vw,28px)}
		.reel-intro h2{font-size:clamp(3.8rem,16vw,5.9rem);line-height:.82;margin:clamp(34px,6vh,48px) 0 18px}
		.reel-hint{font-size:0;line-height:1.7}
		.reel-hint::before{content:'Swipe across';display:block;font:9px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:#8f9d98}
		.work-reel .reel-hint{color:rgba(11,27,36,.72)}
		.work-reel .reel-hint span{color:#fff}
		.work-reel h2 em{color:#fff}
		.work-reel .reel-meta{color:rgba(11,27,36,.72)}
		.work-reel .reel-meta strong{color:#0b1b24}
		.reel-track{width:100%;max-width:100vw;min-width:0;gap:14px;padding:12px clamp(18px,7vw,28px) 44px;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;touch-action:pan-x pinch-zoom}
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
		.card-brand .card-mark{width:clamp(50px,14vw,62px)}
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
		.hero-mark{width:54px}
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
		transition:transform .28s cubic-bezier(.2,.75,.2,1),box-shadow .35s ease;
		will-change:transform;
		touch-action:manipulation;
	}
	.business-card{box-shadow:0 28px 34px rgba(0,0,0,.28)}
	.business-card:hover{--card-lift:4px;box-shadow:0 34px 38px rgba(0,0,0,.3)}
	@keyframes card-shadow-flip{0%,100%{box-shadow:0 28px 34px rgba(0,0,0,.28)}45%,55%{box-shadow:0 0 0 rgba(0,0,0,0)}}
	.business-card.card-flipping{animation:card-shadow-flip .9s ease both}
	.card-face::before{transform:translate3d(calc(var(--card-shift-x) * -0.55),calc(var(--card-shift-y) * -0.55),0) scale(1.04)}
	.business-card:hover .card-face::before{transform:translate3d(calc(var(--card-shift-x) * -0.55),calc(var(--card-shift-y) * -0.55),0) scale(1.07)}
	.card-face::after{background:none}
	/* Keep the type in a light 2D path: a small vertical parallax reads as depth
	   without applying the card's perspective transform to every glyph. */
	.card-face > *{transform:translateY(calc(var(--card-shift-y) * .32));transition:transform .18s ease-out}
	@media(prefers-reduced-motion:reduce){.business-card{transform:none;transition:none;will-change:auto}.business-card.card-flipping{animation:none}.card-face::before,.business-card:hover .card-face::before,.card-face > *{transform:none;transition:none}}
	:global(.low-power) .work-puddles,
	:global(.low-power) .about-rain,
	:global(.low-power) .storm-rain,
	:global(.low-power) .storm-flash{display:none!important}
	:global(.low-power) .reel-photo img{transition:none;filter:none}
	:global(.low-power) .reel-track{will-change:transform}
	:global(.low-power) .business-card{will-change:auto;transition:none;box-shadow:none}
	:global(.low-power) .business-card.card-flipping{animation:none}

	/* Square image theme: every homepage photograph gets the same frame language. */
	.hero-portrait{aspect-ratio:1;height:auto;min-height:0;border:0;background:#172326}
	.hero-portrait{max-height:min(78vw,760px)}
	.hero-slide:not(:first-child){opacity:0;visibility:hidden}
	.about-portrait{aspect-ratio:3/4;height:auto;min-height:0;border:0;background:#ccd4c9}
	.reel-photo{aspect-ratio:4/5;height:auto;min-height:0;border:0;background:#283331}
	.reel-card.hero-card .reel-photo{aspect-ratio:3/4}
	.reel-photo::after{display:none}
	.reel-photo img{object-fit:cover;object-position:center}
	@media(max-width:760px){.hero-portrait{max-height:none}.about-portrait{max-width:none}}

	/* Current direction: warm orange accents, editorial neutrals, and a lens mark
	   that keeps the name central without turning the identity into a weather pun. */
	:global(:root){--rain-accent:#ff5b1a;--rain-accent-deep:#a53d13;--rain-accent-faint:rgba(255,91,26,.2)}
	.contact{background:#e8dfd5;color:#1b1714}
	.contact h2 em{color:#ff5b1a}
	.contact .eyebrow,.contact-footer{color:#a53d13}
	.card-face::after{border-color:rgba(255,91,26,.5)}
	.card-back::before{background:linear-gradient(125deg,rgba(4,12,14,.9) 0%,rgba(4,12,14,.5) 52%,rgba(255,91,26,.18) 100%),var(--card-bg)}
	@media(max-width:760px){.contact{background:#e8dfd5}}

	/* Keep the contact footer in normal flow so it cannot sit on top of the card. */
	.contact-footer{position:static;margin-top:clamp(64px,8vh,110px);padding-bottom:4px;min-height:24px;align-items:center;gap:18px}
	.download-card{grid-column:2;justify-self:start;display:flex;align-items:center;gap:11px;margin-top:-clamp(55px,6vh,82px);padding:12px 0;border:0;border-bottom:1px solid rgba(27,23,20,.55);background:none;color:#a53d13;cursor:pointer;font:11px 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;text-align:left}
	.download-card span{font-size:20px;line-height:0;color:#ff5b1a}
	.download-card small{display:block;margin-left:8px;color:#786f68;font:9px 'DM Mono',monospace;letter-spacing:.05em;text-transform:none}
	.download-card:hover{color:#1b1714}
	@media(max-width:760px){.download-card{grid-column:auto;margin:20px 0 0;padding:11px 0;flex-wrap:wrap}.download-card small{flex-basis:100%;margin-left:31px}.contact-footer{margin-top:clamp(64px,10vh,92px)}}

	/* Touch targets and mobile interaction affordances. */
	@media(max-width:760px){
		:global(html){scroll-padding-top:75px}
		.email,.download-card,.contact-footer a{min-height:44px;align-items:center}
		.email{display:inline-flex}
		.reel-track{scroll-behavior:smooth;scrollbar-width:auto}
		.reel-track:focus-visible{outline-offset:-3px}
	}
	@media(hover:none){.reel-card:hover img{transform:none;filter:none}.business-card:hover{--card-lift:0;box-shadow:0 28px 34px rgba(0,0,0,.28)}}

	/* Contact details and footer alignment */
	.contact-layout{position:relative}
	.email{display:block;width:max-content;max-width:100%;border:0;padding:0;font-family:inherit;font-size:clamp(1rem,1.8vw,1.5rem)}
	.email::after{display:none}
	.phone{display:block;width:max-content;margin-top:14px;border:0;font-size:clamp(1rem,1.8vw,1.5rem);letter-spacing:-.03em}
	.download-card{position:static;display:inline-flex;align-items:center;gap:10px;margin:18px 0 0;padding:0;border:0;color:#a53d13;font:inherit;font-size:clamp(1rem,1.8vw,1.5rem);letter-spacing:-.03em;text-transform:none}
	.download-card span{color:inherit;font-size:inherit;line-height:1}
	.download-card .download-arrow{font-size:1.2em;color:#ff5b1a}
	.download-card small{display:none}
	.contact-details > .email,
	.contact-details > .phone,
	.contact-details > .download-card{position:relative;transition:color .25s ease,transform .25s ease}
	.contact-details > .email::after,
	.contact-details > .phone::after,
	.contact-details > .download-card::after{content:'';position:absolute;left:0;right:0;bottom:-6px;height:1px;background:var(--rain-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.75,.2,1)}
	.contact-details > .email:hover,
	.contact-details > .phone:hover,
	.contact-details > .download-card:hover{color:var(--rain-accent);transform:translateX(7px)}
	.contact-details > .email:hover::after,
	.contact-details > .phone:hover::after,
	.contact-details > .download-card:hover::after{transform:scaleX(1)}
	.email span{display:inline-block;transition:transform .25s ease}
	.email:hover span{transform:translate(3px,-3px)}
	.download-card .download-arrow{transition:transform .25s ease,color .25s ease}
	.download-card:hover .download-arrow{transform:translateY(4px)}
	@media(prefers-reduced-motion:reduce){.contact-details > .email,.contact-details > .phone,.contact-details > .download-card,.email span,.download-card .download-arrow{transition:none}}
	.contact-footer{
		display:grid;
		grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);
		align-items:end;
		gap:24px;
		width:100%;
	}
	/* The stacking rule above makes the footer relative; reset its horizontal
	   offset so it stays aligned with the contact section's content edge. */
	.contact > .contact-footer{left:0;right:0}
	.contact-footer span,.contact-footer a{min-width:0;overflow-wrap:anywhere}
	.contact-footer span:nth-child(2){justify-self:center;text-align:center}
	.contact-footer a{justify-self:end;text-align:right;white-space:nowrap}
	@media(max-width:760px){
		.email{width:fit-content}
		.download-card{margin-top:18px;font-size:clamp(.95rem,4.7vw,1.25rem)}
		.contact-footer{display:grid;grid-template-columns:1fr auto;align-items:end}
		.contact-footer span:nth-child(2){justify-self:start}
		.contact-footer a{justify-self:end}
	}
	.card-face.card-back{padding:0}
	.card-face::after{border:0}
	.business-card::after{content:'Flip to connect →';position:absolute;top:calc(100% + 14px);left:0;width:100%;color:#111817;font:700 clamp(11px,1.1vw,14px) 'DM Mono',monospace;letter-spacing:.1em;text-align:center;text-transform:uppercase;pointer-events:none;opacity:1;transition:opacity .28s ease;transform-origin:center;animation:flip-hint-pulse 2.8s ease-in-out infinite}
	.business-card.flipped::after{opacity:0;animation:none}
	@keyframes flip-hint-pulse{0%,100%{opacity:.62;transform:scale(1)}50%{opacity:1;transform:scale(1.035)}}
	@media(prefers-reduced-motion:reduce){.business-card::after{animation:none}}
	.card-flip-hint{display:none}
	.card-brand small{color:#ff8a5c;font-size:clamp(11px,1.5vw,17px);font-weight:600;letter-spacing:.3em}
	@media(max-width:760px){.card-flip-hint{margin-top:12px}.card-brand small{font-size:10px}}
</style>

<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
		['reel-portrait.jpg', '06 / Final edits', 'portrait / 2024']
	];
	let menuOpen = false;
	let cardFlipped = false;
	const cardBg = asset('776442682_1588100949420590_8353220821612154198_n.jpg');

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) return;
		const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
		intro.from('.topbar', { y: -30, opacity: 0, duration: 0.8 })
			.from('.hero-kicker, .hero-title .line, .hero-copy', { y: 45, opacity: 0, stagger: 0.11, duration: 1 }, '-=.35')
			.from('.hero-portrait', { clipPath: 'inset(0 0 100% 0)', scale: 1.12, duration: 1.4 }, '-=.9')
			.from('.hero-orbit, .hero-scroll', { opacity: 0, scale: 0.7, duration: 0.7 }, '-=.5');

		gsap.to('.hero-slide img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
		const ambientBackground = document.querySelector('.ambient-background');
		if (ambientBackground) {
			gsap.to(ambientBackground, {
				backgroundPosition: '50% 100%',
				ease: 'none',
				scrollTrigger: { trigger: '.shell', start: 'top top', end: 'bottom bottom', scrub: 1 }
			});
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
		const reelTrack = document.querySelector('.reel-track');
		if (reelTrack) {
			const distance = () => Math.max(0, reelTrack.scrollWidth - window.innerWidth + 40);
			gsap.to(reelTrack, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: '.work-reel', start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.7}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
		}
		gsap.to('.contact-glow', { rotation: 360, duration: 22, repeat: -1, ease: 'none' });
		return () => {
			slideshow.kill();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<svelte:head>
	<title>Zac Rains — Wisconsin Photographer | Portraits, Weddings &amp; Wild Places</title>
	<meta name="description" content="Zac Rains is a Wisconsin photographer creating honest portraits, wedding photographs, family sessions, and wild-place stories that feel like rain on glass." />
	<meta name="author" content="Zac Rains" />
	<meta name="keywords" content="Wisconsin photographer, portrait photographer, wedding photographer, family photographer, wildlife photography, Zac Rains" />
	<meta name="robots" content="index, follow" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Zac Rains — Wisconsin Photographer" />
	<meta property="og:description" content="Honest portraits, weddings, families, and wild-place stories by Wisconsin photographer Zac Rains." />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Zac Rains — Wisconsin Photographer" />
	<meta name="twitter:description" content="Honest portraits, weddings, families, and wild-place stories by Wisconsin photographer Zac Rains." />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Zac Rains",
			"jobTitle": "Photographer",
			"description": "Wisconsin photographer creating honest portraits, wedding photographs, family sessions, and wild-place stories.",
			"email": "astrozac@outlook.com",
			"address": {
				"@type": "PostalAddress",
				"addressRegion": "WI",
				"addressCountry": "US"
			},
			"knowsAbout": ["Portrait photography", "Wedding photography", "Wildlife photography", "Landscape photography"]
		}
	</script>
</svelte:head>

<div class="shell">
	<div class="ambient-background" aria-hidden="true"></div>
	<header class="topbar">
		<a class="logo" href="/" aria-label="Zac Rains home">
			<svg class="rain-mark" viewBox="0 0 60 44" width="38" height="28" role="img" aria-label="Rain cloud">
				<path class="cloud" d="M12,26 C6,26 6,18 12,17 C14,11 22,9 27,12 C31,7 39,7 44,12 C49,11 51,18 48,21 C51,24 48,28 43,28 H14 C10,28 10,26 12,26 Z" />
				<g class="drops">
					<line x1="18" y1="29" x2="16" y2="40" class="drop" />
					<line x1="30" y1="29" x2="28" y2="43" class="drop drop-mid" />
					<line x1="42" y1="29" x2="40" y2="40" class="drop" />
				</g>
			</svg>
			<span>ZAC<br />RAINS</span>
		</a>
		<nav class:open={menuOpen}><a href="#about" onclick={() => (menuOpen = false)}>About</a><a href="#work" onclick={() => (menuOpen = false)}>Work</a><a href="#contact" onclick={() => (menuOpen = false)}>Contact</a></nav>
		<div class="top-actions"><span class="availability"><b></b>Available, rain or shine</span><a class="outline-button" href="#contact">Let's talk <i>↗</i></a><button class="menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}><span></span><span></span></button></div>
	</header>

	<main>
		<section class="hero chapter" id="top">
			<div class="hero-copy-wrap">
				<p class="eyebrow hero-kicker"><span>01</span> Photographer / Wisconsin + wherever the clouds take me</p>
				<h1 class="hero-title"><span class="line">Chasing</span><span class="line orange">light</span> <span class="line bold">through rain.</span></h1>
				<p class="hero-copy">Photographs for the wild-hearted, the soft-hearted, and everyone who wants to remember exactly how it felt — rain or shine.</p>
			</div>
			<div class="hero-portrait" aria-label="Selected photography slideshow">{#each heroSlides as slide, i}<div class="hero-slide"><img src={asset(slide[0])} alt={slide[1]} /><div class="slide-caption">{String(i + 1).padStart(2, '0')} / {slide[1]}</div></div>{/each}<div class="portrait-label">ZAC RAINS / FIELD NOTES<br /><span>SELECTED WORK / 2024</span></div></div>
			<div class="hero-orbit"><span>RAIN OR SHINE · CHASE THE LIGHT · </span></div>
			<a class="hero-scroll" href="#about">Scroll to explore <b>↓</b></a>
		</section>

		<div class="rain-break" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
		<section class="about chapter" id="about">
			<div class="section-top reveal"><p class="eyebrow"><span>02</span> The person behind the storm</p><span class="section-index">ABOUT / 2026</span></div>
			<div class="about-layout"><div class="about-heading reveal"><p class="side-note">A little<br />about me</p><h2>Hi, I'm<br /><em>Zac.</em></h2></div><div class="about-portrait reveal"><img src={portrait} alt="Zac Rains smiling outdoors" /><span>THE GUY<br />BEHIND THE<br />LENS ↘</span></div><div class="about-text reveal"><p class="large-copy">Photographer, storm chaser, and professional third wheel.</p><p>I chase the kind of images that feel like weather — a little imperfect, always honest, and impossible to fake. From Wisconsin back roads to the wild edges of Kenya, I wait for the split second that makes a story stick.</p><div class="facts"><span>Portraits</span><span>Weddings</span><span>Families</span><span>Wild places</span></div><a class="text-link" href="#work">See the work <span>↘</span></a></div></div>
			<div class="about-marquee" aria-hidden="true"><span>RAINS / CLOUDS / LIGHT / PRESENCE / </span><span>RAINS / CLOUDS / LIGHT / PRESENCE / </span></div>
		</section>

		<section class="work-reel chapter" id="work">
			<div class="reel-intro"><p class="eyebrow"><span>03</span> Selected work</p><h2>Frames<br /><em>worth<br />keeping.</em></h2><p class="reel-hint">Keep scrolling<br /><span>→</span></p></div>
			<div class="reel-track">{#each reel as item, i}<a class:hero-card={i === 0} class="reel-card" href="#contact"><div class="reel-photo"><img src={asset(item[0])} alt={item[1]} loading={i > 1 ? 'lazy' : 'eager'} /><span class="view-arrow">↗</span></div><div class="reel-meta"><strong>{item[1]}</strong><span>{item[2]}</span></div></a>{/each}</div>
		</section>

		<section class="contact chapter" id="contact">
			<div class="contact-glow" aria-hidden="true"></div><div class="section-top"><p class="eyebrow"><span>04</span> Before the storm</p><span class="section-index">LET'S CONNECT</span></div>
			<div class="contact-layout"><div><h2>Let's make<br /><em class="contact-highlight">something</em><br />real.</h2><a class="email" href="mailto:astrozac@outlook.com">astrozac@outlook.com <span>↗</span></a></div><button class="business-card" class:flipped={cardFlipped} onclick={() => (cardFlipped = !cardFlipped)} aria-label="Flip Zac Rains business card"><span class="card-face card-front" style="--card-bg: url({cardBg})"><b class="card-mark">RAINS</b><small>PHOTOGRAPHY</small><i>Click to flip ↗</i></span><span class="card-face card-back" style="--card-bg: url({cardBg})"><strong>ZAC RAINS</strong><small class="card-info"><em>PHOTOGRAPHER</em><a href="tel:262-232-9332" class="card-link">262—232—9332</a><a href="mailto:astrozac@outlook.com" class="card-link">astrozac@outlook.com</a><a href="https://rainsphotography.com" target="_blank" rel="noopener" class="card-link">rainsphotography.com</a><span>WISCONSIN • AVAILABLE TO TRAVEL</span><span>PORTRAITS • COUPLES • FAMILIES • WEDDINGS • EVENTS</span></small><i>Click to flip ↙</i></span></button></div>
			<div class="contact-footer"><span>© {new Date().getFullYear()} Zac Rains Photography</span><span>Good light, even after the rain.</span><a href="#top">Back to top ↑</a></div>
		</section>
	</main>
</div>

<style>
	:global(*){box-sizing:border-box}:global(html){scroll-behavior:smooth}:global(body){margin:0;overflow-x:hidden;background:#111516;color:#f1eee7}:global(a){color:inherit;text-decoration:none}:global(button){font:inherit}.shell{position:relative;overflow:hidden;background:transparent}.ambient-background{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,#7e8381 0%,#202728 25%,#050707 48%,#f1eee7 73%,#6f7472 100%);background-size:100% 300%;background-position:50% 0%;will-change:background-position}.topbar{height:88px;padding:23px 4.5vw;border-bottom:1px solid rgba(39,53,53,.55);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:10;background:rgba(10,14,14,.18);backdrop-filter:blur(14px)}.logo{display:flex;align-items:center;gap:11px;font-size:14px;font-weight:700;letter-spacing:.13em;line-height:.85}.top-actions{display:flex;align-items:center;gap:25px}.availability,.eyebrow,.section-index,.portrait-label,.reel-meta,.contact-footer,.card-face small{font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}.availability{color:#94a19d}.availability b{width:6px;height:6px;display:inline-block;background:#ff5b1a;border-radius:50%;margin-right:7px}.outline-button{border:1px solid #62706c;padding:10px 15px;font-size:12px}.outline-button i,.email span,.text-link span{color:#ff5b1a;font-style:normal;margin-left:10px}.outline-button:hover{background:#ff5b1a;color:#0a0e0e;border-color:#ff5b1a}nav{display:flex;gap:39px;margin-left:auto;margin-right:7vw;font:11px 'DM Mono',monospace;text-transform:uppercase;color:#9da9a5;letter-spacing:.08em}nav a:hover,.text-link:hover{color:#ff5b1a}.menu{display:none;background:none;border:0}.chapter{position:relative}.hero{min-height:calc(100vh - 88px);display:grid;grid-template-columns:51% 49%;padding:8vh 7vw 7vh 9vw;isolation:isolate}.hero-copy-wrap{align-self:center;position:relative;z-index:2}.eyebrow{color:#93a09c;margin:0}.eyebrow span{color:#ff5b1a;margin-right:17px}.hero-title,h2{font-size:clamp(5rem,10vw,10.5rem);font-weight:500;line-height:.8;letter-spacing:-.095em;margin:70px 0 48px}.hero-title .line{display:block}.hero-title .orange,h2 em{color:#ff5b1a;font-style:normal}.hero-title .bold{font-weight:700;margin-left:10vw}.hero-copy{max-width:260px;color:#aab3af;line-height:1.55;font-size:13px}.hero-portrait{position:absolute;z-index:0;right:7vw;top:5vh;width:min(43vw,580px);height:78vh;overflow:hidden;background:#202929;clip-path:polygon(8% 0,100% 0,92% 100%,0 100%)}.hero-portrait:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(5,9,9,.7))}.hero-slide{position:absolute;inset:0}.hero-slide img{width:100%;height:115%;object-fit:cover;object-position:center;filter:saturate(.88) contrast(1.04)}.slide-caption{position:absolute;top:25px;right:28px;z-index:1;font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:#f1eee7}.portrait-label{position:absolute;z-index:1;bottom:25px;left:28px;color:#f1eee7;line-height:1.8}.portrait-label span{color:#ff5b1a}.hero-orbit{position:absolute;right:4vw;bottom:5vh;width:132px;height:132px;border:1px solid #ff5b1a;border-radius:50%;display:grid;place-items:center;color:#ff5b1a;font:9px 'DM Mono',monospace;text-align:center}.hero-orbit span{animation:spin 15s linear infinite}.hero-scroll{position:absolute;bottom:5vh;left:9vw;font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:#8f9b97}.hero-scroll b{display:inline-grid;place-items:center;margin-left:13px;width:30px;height:30px;border:1px solid #65716e;border-radius:50%;font-size:15px;color:#ff5b1a}.about{padding:13vh 9vw 0;min-height:100vh;background:#edf0e8;color:#111717;overflow:hidden}.section-top{display:flex;justify-content:space-between;align-items:center}.about .eyebrow{color:#65736f}.section-index{color:#8a9691}.about-layout{display:grid;grid-template-columns:1fr .72fr 1fr;gap:4vw;align-items:end;margin-top:15vh}.about h2{font-size:clamp(5.5rem,11vw,12rem);margin:0;color:#111717}.side-note{font:10px 'DM Mono',monospace;text-transform:uppercase;color:#78837e;line-height:1.6;letter-spacing:.1em;margin-bottom:30px}.about-portrait{position:relative;aspect-ratio:3/4;max-width:280px;overflow:hidden;background:#ccd4c9}.about-portrait img{width:100%;height:100%;object-fit:cover;filter:saturate(.82)}.about-portrait:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(10,14,14,.55))}.about-portrait span{position:absolute;z-index:1;bottom:16px;left:16px;color:#f1eee7;font:10px 'DM Mono',monospace;line-height:1.6;letter-spacing:.08em}.about-text{max-width:420px;padding-bottom:2vh}.large-copy{font-size:clamp(1.55rem,2.4vw,2.5rem);line-height:1.05;letter-spacing:-.04em;margin:0 0 28px}.about-text>p:not(.large-copy){color:#65706c;line-height:1.6;font-size:14px}.facts{display:flex;flex-wrap:wrap;gap:8px;margin:34px 0}.facts span{border:1px solid #b6c0b8;padding:8px 10px;font:10px 'DM Mono',monospace;text-transform:uppercase}.text-link{display:inline-block;border-bottom:1px solid #a6b1aa;padding-bottom:9px;font:11px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.08em}.about-marquee{display:flex;width:max-content;gap:30px;margin-top:16vh;color:#d8ded5;font-size:clamp(4rem,10vw,11rem);font-weight:700;line-height:.7;letter-spacing:-.08em;white-space:nowrap;transform:translateX(-10%)}.about-marquee span:last-child{color:#111717}.work-reel{min-height:100vh;padding:10vh 0 8vh;background:#111817;color:#f1eee7;display:flex;align-items:center;gap:7vw}.reel-intro{flex:0 0 31vw;padding-left:9vw}.reel-intro h2{font-size:clamp(4rem,7vw,8rem);margin:75px 0 55px}.reel-hint{font:10px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;color:#8f9d98;line-height:2}.reel-hint span{color:#ff5b1a;font-size:25px}.reel-track{display:flex;align-items:flex-start;gap:27px;width:max-content;padding-right:9vw}.reel-card{display:block;width:25vw;min-width:300px}.reel-card.hero-card{width:31vw;min-width:370px;margin-top:-5vh}.reel-photo{position:relative;aspect-ratio:4/5;overflow:hidden;background:#283331}.reel-card.hero-card .reel-photo{aspect-ratio:3/4}.reel-photo img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .5s}.reel-card:hover img{transform:scale(1.07);filter:saturate(1.15)}.view-arrow{position:absolute;right:15px;top:15px;display:grid;place-items:center;width:42px;height:42px;background:#ff5b1a;color:#0a0e0e;border-radius:50%;font-size:20px;opacity:0;transform:translate(-10px,10px);transition:.4s}.reel-card:hover .view-arrow{opacity:1;transform:none}.reel-meta{display:flex;justify-content:space-between;gap:12px;padding-top:15px;color:#96a39e}.reel-meta strong{color:#f1eee7;font-weight:400}.contact{min-height:100vh;padding:11vh 9vw 28px;background:#f15a24;color:#111817;overflow:hidden}.contact .eyebrow{color:#793119}.contact-glow{position:absolute;width:52vw;height:52vw;right:-15vw;top:8vh;border:1px solid rgba(17,24,23,.3);border-radius:50%;box-shadow:0 0 0 35px rgba(17,24,23,.07),0 0 0 70px rgba(17,24,23,.05);pointer-events:none}.contact-layout{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:8vw;margin-top:13vh}.contact h2{font-size:clamp(5rem,9.5vw,10rem);margin:0 0 55px}.email{display:inline-block;border-bottom:1px solid #111817;padding-bottom:13px;font-size:clamp(1rem,1.8vw,1.5rem);letter-spacing:-.03em}.business-card{width:min(100%,450px);aspect-ratio:1.65;border:0;padding:0;background:none;perspective:1000px;cursor:pointer;text-align:left}.card-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:30px;background:#0e1716;color:#f1eee7;backface-visibility:hidden;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.76,0,.24,1);box-shadow:17px 17px 0 rgba(17,24,23,.16)}.business-card{position:relative}.card-front{transform:rotateY(0deg)}.card-back{transform:rotateY(-180deg);background:#f1eee7;color:#111817}.business-card.flipped .card-front{transform:rotateY(180deg)}.business-card.flipped .card-back{transform:rotateY(0deg)}.card-mark{font:clamp(3rem,7vw,5rem) 'Space Grotesk',sans-serif;color:#ff5b1a;letter-spacing:-.12em}.card-face strong{font-size:clamp(2rem,4vw,4rem);line-height:.8;letter-spacing:-.08em}.card-face small{line-height:1.7}.card-face i{align-self:flex-end;font:10px 'DM Mono',monospace;font-style:normal;color:#ff5b1a}.card-back strong{color:#111817}.card-back em{color:#ff5b1a;font-style:normal}.contact-footer{position:absolute;left:9vw;right:9vw;bottom:28px;display:flex;justify-content:space-between;color:#6f2917}.contact-footer a:hover{color:#111817}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:760px){.topbar{height:75px;padding:19px 18px}.availability,.outline-button{display:none}.menu{display:block;padding:5px}.menu span{display:block;width:24px;height:1px;background:#f1eee7;margin:5px}nav{display:none;position:absolute;top:75px;left:0;right:0;margin:0;padding:24px 18px;flex-direction:column;gap:20px;background:#0a0e0e}nav.open{display:flex}.hero{min-height:calc(100vh - 75px);display:block;padding:60px 18px 35px}.hero-title{font-size:clamp(4.5rem,19vw,7rem);margin:90px 0 38px}.hero-title .bold{margin-left:18vw}.hero-portrait{right:18px;top:38%;width:78vw;height:52vh;opacity:.85}.hero-copy-wrap{position:relative;z-index:2}.hero-copy{margin-bottom:52vh}.hero-orbit{width:92px;height:92px;right:18px;bottom:11vh;font-size:7px}.hero-scroll{left:18px;bottom:35px}.about{padding:70px 18px 0;min-height:100vh}.section-top{align-items:flex-start}.section-index{font-size:8px}.about-layout{display:block;margin-top:90px}.about-portrait{width:70%;max-width:none;margin:0 0 45px auto}.about h2{font-size:clamp(4.8rem,20vw,7rem);margin-bottom:60px}.about-text{padding:0}.about-marquee{margin-top:100px}.work-reel{display:block;padding:80px 0 55px;min-height:auto}.reel-intro{padding:0 18px}.reel-intro h2{font-size:clamp(4rem,18vw,6.5rem);margin:60px 0 30px}.reel-track{width:auto;overflow-x:auto;padding:5px 18px 25px;gap:16px;scroll-snap-type:x mandatory}.reel-card,.reel-card.hero-card{width:78vw;min-width:78vw;margin:0;scroll-snap-align:start}.contact{min-height:900px;padding:70px 18px 30px}.contact-layout{display:block;margin-top:105px}.contact h2{font-size:clamp(4.7rem,19vw,7rem);margin-bottom:45px}.business-card{margin-top:95px;width:100%}.contact-glow{width:100vw;height:100vw;right:-50vw;top:30vh}.contact-footer{left:18px;right:18px;bottom:25px;gap:15px;flex-wrap:wrap}.contact-footer span:nth-child(2){display:none}}
	@media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.hero-slide img,.about-marquee{transform:none!important}.hero-orbit span{animation:none}.card-face,.reel-photo img{transition:none}}
.rain-mark{display:block;width:38px;height:28px;cursor:pointer;overflow:visible}.rain-mark .cloud{fill:#f1eee7;transition:fill .25s ease,transform .25s ease}.rain-mark:hover .cloud{fill:#ff5b1a;transform:translateY(-2px)}.rain-mark .drop{stroke:#ff5b1a;stroke-width:2.2;stroke-linecap:round;opacity:.9;animation:pour 1.1s linear infinite;transform-origin:center}.rain-mark .drop:nth-child(2){animation-delay:.2s}.rain-mark .drop:nth-child(3){animation-delay:.45s}.rain-mark:hover .drop{animation-duration:.65s}@keyframes pour{0%{transform:translateY(-4px);opacity:0}15%{opacity:1}100%{transform:translateY(16px);opacity:0}}.rain-break{height:80px;display:flex;justify-content:space-evenly;align-items:flex-start;padding:0 20vw;overflow:hidden;background:#0a0e0e}.rain-break span{width:1px;height:100%;background:linear-gradient(180deg,transparent 0%,#ff5b1a 45%,transparent 100%);opacity:.35;transform:translateY(-110%);animation:rain-fall 2.2s linear infinite}.rain-break span:nth-child(2n){animation-delay:.3s;animation-duration:2.8s}.rain-break span:nth-child(3n){animation-delay:.8s;animation-duration:1.9s}@keyframes rain-fall{0%{transform:translateY(-110%);opacity:0}20%{opacity:.35}100%{transform:translateY(110%);opacity:0}}.card-front{background:linear-gradient(rgba(10,14,14,.88),rgba(10,14,14,.88)),var(--card-bg)}.card-back{background:linear-gradient(rgba(241,238,231,.9),rgba(241,238,231,.9)),var(--card-bg)}.business-card .card-front,.business-card .card-back{background-size:cover,cover;background-position:center,center}.card-info{display:flex;flex-direction:column;gap:9px;line-height:1.45;margin-top:auto;margin-bottom:8px}.card-info em{font-style:normal;color:#ff5b1a}.card-link{color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.card-link:hover{color:#ff5b1a}@media(max-width:760px){.rain-mark{width:34px;height:25px}}.contact-highlight{color:#f1eee7}
</style>

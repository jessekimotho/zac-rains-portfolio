<script>
	import { onMount } from 'svelte';
	import LensLogo from '$lib/LensLogo.svelte';

	onMount(() => {
		if (new URLSearchParams(window.location.search).has('print')) {
			window.setTimeout(() => window.print(), 350);
		}
	});
</script>

<svelte:head>
	<title>Zac Rains — Business Card Print Sheet</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<header class="controls">
		<div><strong>Zac Rains business card</strong><span>Two pages · front and back · 3.5 × 2 in trim · 0.125 in bleed</span></div>
		<div class="actions"><a href="/">Back to site</a><button onclick={() => window.print()}>Print / Save as PDF</button></div>
	</header>

	<section class="sheet" aria-label="Business card front and back">
		<article class="card front" aria-label="Business card front">
			<div class="frame" aria-hidden="true"></div>
			<div class="brand">
				<span class="mark"><LensLogo delay="-2.15s" /></span>
				<span><b>RAINS</b><small>PHOTOGRAPHY</small></span>
			</div>
		</article>

		<article class="card back" aria-label="Business card back">
			<div class="frame" aria-hidden="true"></div>
			<div class="contact-info">
				<a href="tel:262-232-9332"><small>CALL</small><span>262—232—9332</span></a>
				<a href="mailto:astrozac@outlook.com"><small>MAIL</small><span>astrozac@outlook.com</span></a>
			</div>
		</article>
	</section>

	<p class="note">For PDF: select “Save as PDF”, keep scale at 100%, margins at none, and enable background graphics.</p>
</main>

<style>
	:global(html){background:#d8d3cc}
	:global(body){margin:0;background:#d8d3cc;color:#171310}
	:global(*){box-sizing:border-box}
	main{min-height:100vh;padding:30px;font-family:'Space Grotesk',sans-serif}
	.controls{display:flex;justify-content:space-between;align-items:center;gap:28px;max-width:1000px;margin:0 auto 28px}
	.controls strong,.controls span{display:block}.controls strong{font-size:18px}.controls span,.note{margin-top:5px;color:#665f58;font:11px 'DM Mono',monospace;letter-spacing:.04em}
	.actions{display:flex;align-items:center;gap:12px}.actions a,.actions button{padding:12px 15px;border:1px solid #171310;background:transparent;color:#171310;font:11px 'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em;cursor:pointer}.actions button{background:#ff5b1a;border-color:#ff5b1a;color:#fff}
	.sheet{display:grid;gap:34px;justify-content:center}.card{position:relative;width:7.5in;height:4.5in;overflow:hidden;color:#f1eee7;background:#0e1716 url('/card-background.jpg') center/cover;box-shadow:0 20px 48px rgba(0,0,0,.22);print-color-adjust:exact;-webkit-print-color-adjust:exact}.card::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(8,11,12,.58),rgba(8,11,12,.22) 48%,rgba(8,11,12,.56));}.back{background-position:center bottom}.back::before{background:linear-gradient(125deg,rgba(4,12,14,.9),rgba(4,12,14,.5) 52%,rgba(76,166,216,.2));filter:saturate(1.25) contrast(1.12);transform:scale(1.06)}
	.frame{display:none}.brand{position:absolute;z-index:2;inset:1.15in .6in 1in .35in;display:flex;align-items:center;gap:.3in}.mark{display:block;width:1.35in;flex:none}.brand b{display:block;font-size:1.68in;font-weight:600;line-height:.72;letter-spacing:-.1em}.brand small{display:block;margin-top:.22in;color:#ff8a5c;font:600 22px 'DM Mono',monospace;letter-spacing:.3em}
	.contact-info{position:absolute;z-index:2;inset:.62in .3in;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:.25in}.contact-info::before{content:'';position:absolute;left:7%;right:7%;top:50%;height:1px;background:linear-gradient(90deg,transparent,#4ca6d8,transparent);opacity:.72}.contact-info a{display:flex;flex-direction:column;gap:.12in;color:#f1eee7;text-decoration:none;font-family:'DM Mono',monospace}.contact-info small{color:#ff9a6e;font-size:18px;font-weight:600;letter-spacing:.22em}.contact-info span{font-size:.3in;line-height:1.14;letter-spacing:.04em}.contact-info a:first-child span{font-size:.42in;white-space:nowrap}
	.note{max-width:1000px;margin:24px auto 0;text-align:center}
	@media(max-width:900px){main{padding:20px 12px}.controls{align-items:flex-start;flex-direction:column}.sheet{width:100%;overflow:auto;justify-content:start}.card{width:min(7.5in,94vw);height:auto;aspect-ratio:5/3}.brand b{font-size:clamp(48px,16vw,146px)}.brand small{font-size:clamp(8px,2.3vw,22px)}.contact-info span{font-size:clamp(14px,3.2vw,29px)}.contact-info a:first-child span{font-size:clamp(18px,4.4vw,40px)}}
	@page{size:3.75in 2.25in;margin:0}
	@media print{ :global(html),:global(body){width:3.75in;height:auto;background:#fff} main{padding:0;min-height:0}.controls,.note{display:none}.sheet{display:block}.card{width:3.75in;height:2.25in;box-shadow:none;break-after:page;page-break-after:always}.card:last-child{break-after:auto;page-break-after:auto}.brand{inset:.58in .34in .52in .18in;gap:.14in}.mark{width:.72in}.brand b{font-size:.94in}.brand small{margin-top:.12in;font-size:11px}.contact-info{inset:.42in .3in;gap:.2in}.contact-info a{gap:.1in}.contact-info small{font-size:9px}.contact-info span{font-size:.2in}.contact-info a:first-child span{font-size:.27in}}
</style>

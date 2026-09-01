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
			<div class="trim" aria-hidden="true"></div>
			<div class="topline"><span>01 / PERSONAL CARD</span><span>EST. 2024</span></div>
			<div class="brand">
				<span class="print-mark"><LensLogo interactive={false} delay="-4.3s" /></span>
				<div><b>RAINS</b><small>PHOTOGRAPHY</small></div>
			</div>
			<div class="bottomline"><span>WISCONSIN / WORLDWIDE</span><span>FLIP TO CONNECT -&gt;</span></div>
		</article>

		<article class="card back" aria-label="Business card back">
			<div class="trim" aria-hidden="true"></div>
			<div class="back-grid">
				<div class="contact call"><small>CALL</small><strong>262—232—9332</strong></div>
				<div class="contact mail"><small>MAIL</small><strong>astrozac<br />@outlook<br />.com</strong></div>
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
	.sheet{display:grid;gap:34px;justify-content:center}.card{position:relative;width:7.5in;height:4.5in;overflow:hidden;color:#f1eee7;background-image:linear-gradient(115deg,rgba(4,12,14,.83),rgba(4,12,14,.42) 52%,rgba(4,12,14,.82)),url('/card-background.jpg');background-size:cover;background-position:center;box-shadow:0 20px 48px rgba(0,0,0,.22);print-color-adjust:exact;-webkit-print-color-adjust:exact}
	.trim{position:absolute;inset:.25in;border:1px solid rgba(255,91,26,.78);pointer-events:none}
	.topline,.bottomline{position:absolute;left:.58in;right:.58in;display:flex;justify-content:space-between;align-items:center;font:20px 'DM Mono',monospace;letter-spacing:.13em;color:rgba(241,238,231,.7)}
	.topline{top:.48in}.topline span:last-child{color:#ff5b1a}.bottomline{bottom:.5in;font-size:18px}.bottomline span:last-child{color:#ff5b1a}
	.brand{position:absolute;inset:1.35in .58in 1.15in;display:flex;align-items:center;gap:.35in}.print-mark{display:block;width:1.25in;height:auto;overflow:visible;flex:none}.brand b{display:block;font-size:1.52in;font-weight:600;line-height:.72;letter-spacing:-.1em}.brand small{display:block;margin-top:.22in;color:#ff5b1a;font:22px 'DM Mono',monospace;letter-spacing:.34em}
	.back{background-image:linear-gradient(125deg,rgba(4,12,14,.91),rgba(4,12,14,.52) 52%,rgba(255,91,26,.18)),url('/card-background.jpg')}.back-grid{position:absolute;inset:.9in .72in;display:grid;grid-template-columns:1.18fr .82fr;align-items:stretch}.back-grid::before{content:'';position:absolute;left:58%;top:7%;bottom:7%;width:1px;background:linear-gradient(180deg,transparent,#ff5b1a 18%,#ff5b1a 82%,transparent);transform:skew(-12deg)}.contact{position:relative;display:flex;flex-direction:column;justify-content:center;gap:.22in;padding:.25in .35in}.contact small{color:#ff5b1a;font:18px 'DM Mono',monospace;letter-spacing:.22em}.contact strong{font:500 .42in 'DM Mono',monospace;letter-spacing:.02em;line-height:1.14}.call strong{white-space:nowrap}.call::before{content:'';position:absolute;left:0;top:18%;width:7px;height:64%;background:#ff5b1a}.mail{padding-left:.65in}.mail strong{font-size:.3in}
	.note{max-width:1000px;margin:24px auto 0;text-align:center}
	@media(max-width:900px){main{padding:20px 12px}.controls{align-items:flex-start;flex-direction:column}.sheet{width:100%;overflow:auto;justify-content:start}.card{width:min(7.5in,94vw);height:auto;aspect-ratio:5/3}.topline,.bottomline{font-size:clamp(8px,2.1vw,20px)}.brand b{font-size:clamp(48px,16vw,146px)}.brand small{font-size:clamp(8px,2.3vw,22px)}.contact strong{font-size:clamp(18px,4.4vw,40px)}.mail strong{font-size:clamp(14px,3.2vw,29px)}}
	@page{size:3.75in 2.25in;margin:0}
	@media print{
		:global(html),:global(body){width:3.75in;height:auto;background:#fff}
		main{padding:0;min-height:0}.controls,.note{display:none}.sheet{display:block}.card{width:3.75in;height:2.25in;box-shadow:none;break-after:page;page-break-after:always}.card:last-child{break-after:auto;page-break-after:auto}
		.trim{inset:.125in;border-width:.5px}.topline,.bottomline{left:.29in;right:.29in;font-size:10px}.topline{top:.24in}.bottomline{bottom:.25in;font-size:9px}.brand{inset:.675in .29in .575in;gap:.175in}.print-mark{width:.625in}.brand b{font-size:.76in}.brand small{margin-top:.11in;font-size:11px}.back-grid{inset:.45in .36in}.contact{gap:.11in;padding:.125in .175in}.contact small{font-size:9px}.contact strong{font-size:.21in}.call::before{width:3.5px}.mail{padding-left:.325in}.mail strong{font-size:.15in}
	}
</style>

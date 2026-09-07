<script>
	import { onMount } from 'svelte';
	import { defaultSettings, getLocalContent, saveLocalContent, supabase, uploadProjectImage, persistProject, persistProjectImage, deleteProject as deleteRemoteProject, deleteProjectImage, saveSettings } from '$lib/content.js';

	/** @type {{settings: typeof defaultSettings, projects: any[]}} */
	let content = { settings: { ...defaultSettings }, projects: [] };
	let draft = { title: '', description: '', category: 'Selected work', cover_image: '', full_resolution_link: '' };
	let message = '';
	let uploading = false;
	/** @type {any} */
	let session = null;
	let email = '';
	let password = '';
	let loading = true;

	onMount(async () => {
		content = getLocalContent();
		if (supabase) {
			const { data: auth } = await supabase.auth.getSession();
			session = auth.session;
			if (!session) { loading = false; return; }
			const [{ data: settings }, { data: projects }] = await Promise.all([
				supabase.from('site_settings').select('*').single(),
				supabase.from('projects').select('*, project_images(*)').order('sort_order')
			]);
			if (settings) content.settings = { ...content.settings, accentColor: settings.accent_color, backgroundColor: settings.background_color, paperColor: settings.paper_color, bodyFont: settings.body_font, monoFont: settings.mono_font, imageTreatment: settings.image_treatment };
			if (projects) content.projects = projects;
		}
		loading = false;
	});

	async function save() {
		saveLocalContent(content);
		try {
			if (supabase && session) {
				await saveSettings(content.settings);
				await Promise.all(content.projects.map(persistProject));
				message = 'Saved to Supabase.';
			} else message = 'Saved in this browser. Add Supabase keys to enable shared editing.';
		} catch (error) { message = error instanceof Error ? error.message : 'Could not save changes.'; }
		setTimeout(() => (message = ''), 4000);
	}

	function addProject() {
		if (!draft.title.trim()) return;
		content.projects = [...content.projects, { ...draft, id: crypto.randomUUID(), published: true, sort_order: content.projects.length }];
		const created = content.projects.at(-1);
		draft = { title: '', description: '', category: 'Selected work', cover_image: '', full_resolution_link: '' };
		if (created) persistProject(created).then(() => (message = 'Project added.')).catch((error) => (message = error.message));
		saveLocalContent(content);
	}

	/** @param {string} id */
	function removeProject(id) {
		content.projects = content.projects.filter((project) => project.id !== id);
		deleteRemoteProject(id).then(() => (message = 'Project removed.')).catch((error) => (message = error.message));
		saveLocalContent(content);
	}

	/** @param {Event} event @param {any} project */
	async function handleUpload(event, project) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const files = [...(input.files || [])];
		if (!files.length || !supabase) return;
		uploading = true;
		try {
			project.images ||= [];
			for (const file of files) {
				const imageUrl = await uploadProjectImage(file, project.id);
				project.images.push({ id: crypto.randomUUID(), image_url: imageUrl, alt_text: project.title, sort_order: project.images.length });
				if (!project.cover_image) project.cover_image = imageUrl;
				await persistProjectImage(project.id, imageUrl, project.images.length - 1);
			}
			await persistProject(project);
			saveLocalContent(content);
			message = `${files.length} photo${files.length === 1 ? '' : 's'} uploaded.`;
		} catch (error) { message = error instanceof Error ? error.message : 'Upload failed.'; }
		uploading = false;
	}

	/** @param {any} project @param {any} image */
	async function removeImage(project, image) {
		project.images = (project.images || project.project_images || []).filter((/** @type {any} */ item) => item.id !== image.id);
		project.project_images = project.images;
		try { await deleteProjectImage(image.id); saveLocalContent(content); message = 'Photo removed.'; }
		catch (error) { message = error instanceof Error ? error.message : 'Could not remove photo.'; }
	}

	async function login() {
		if (!supabase) return;
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) { message = error.message; return; }
		session = data.session;
		location.reload();
	}

	async function logout() { await supabase?.auth.signOut(); session = null; }
</script>

<svelte:head><title>Content studio — Zac Rains Photography</title></svelte:head>

{#if loading}<main><p>Loading studio…</p></main>
{:else if supabase && !session}<main class="login"><p class="kicker">Zac Rains Photography</p><h1>Private studio</h1><form onsubmit={(event) => { event.preventDefault(); login(); }}><input type="email" placeholder="Email" bind:value={email} required /><input type="password" placeholder="Password" bind:value={password} required /><button>Sign in</button></form>{#if message}<p class="message">{message}</p>{/if}</main>
{:else}<main>
	<header><div><p class="kicker">Zac Rains Photography</p><h1>Content studio</h1></div><div class="header-actions"><a href="/">View site ↗</a>{#if supabase}<button class="delete" onclick={logout}>Sign out</button>{/if}</div></header>
	{#if message}<p class="message">{message}</p>{/if}

	<section class="panel"><div class="section-heading"><div><p class="kicker">01 / Appearance</p><h2>Site settings</h2></div><button onclick={save}>Save settings</button></div>
		<div class="settings-grid">
			<label>Accent colour<input type="color" bind:value={content.settings.accentColor} /></label>
			<label>Background colour<input type="color" bind:value={content.settings.backgroundColor} /></label>
			<label>Paper colour<input type="color" bind:value={content.settings.paperColor} /></label>
			<label>Image treatment<select bind:value={content.settings.imageTreatment}><option value="natural">Natural</option><option value="muted">Muted</option><option value="monochrome">Monochrome</option></select></label>
			<label>Body font<input bind:value={content.settings.bodyFont} placeholder="Space Grotesk" /></label>
			<label>Mono font<input bind:value={content.settings.monoFont} placeholder="DM Mono" /></label>
		</div>
	</section>

	<section class="panel"><div class="section-heading"><div><p class="kicker">02 / Portfolio</p><h2>Projects</h2></div></div>
		<div class="new-project"><input placeholder="Project title" bind:value={draft.title} /><input placeholder="Category" bind:value={draft.category} /><input placeholder="Full-resolution folder link" bind:value={draft.full_resolution_link} /><textarea placeholder="Short description" bind:value={draft.description}></textarea><button onclick={addProject}>+ Add project</button></div>
		{#each content.projects as project, index}
			<article><div><span class="number">{String(index + 1).padStart(2, '0')}</span><input class="project-title" bind:value={project.title} /><input placeholder="Cover image URL" bind:value={project.cover_image} /><input placeholder="Full-resolution folder link" bind:value={project.full_resolution_link} />{#if (project.images || project.project_images)?.length}<small>{(project.images || project.project_images).length} uploaded photo{(project.images || project.project_images).length === 1 ? '' : 's'}</small><div class="gallery">{#each (project.images || project.project_images) as image}<div class="thumb"><img src={image.image_url} alt={image.alt_text || project.title} /><button class="remove-photo" onclick={() => removeImage(project, image)} aria-label="Remove photo">×</button></div>{/each}</div>{/if}</div><div class="project-actions">{#if supabase}<label class="upload">{uploading ? 'Uploading…' : 'Upload photos'}<input type="file" accept="image/*" multiple onchange={(event) => handleUpload(event, project)} /></label>{/if}<button class="delete" onclick={() => removeProject(project.id)}>Remove</button></div></article>
		{/each}
	</section>
</main>{/if}

<style>
	:global(body){background:#e8e4dc;color:#111817}main{max-width:1100px;margin:auto;padding:7vw 5vw 10vw}.login{max-width:620px}.login form{display:grid;gap:12px;max-width:360px;margin-top:45px}header,.section-heading,article{display:flex;align-items:flex-end;justify-content:space-between;gap:25px}.header-actions{display:flex;align-items:center;gap:15px}header{border-bottom:1px solid #aeb5ad;padding-bottom:35px}h1{font-size:clamp(3.5rem,9vw,8rem);font-weight:500;line-height:.8;letter-spacing:-.08em;margin:35px 0 0}h2{font-size:clamp(2rem,4vw,4rem);font-weight:500;letter-spacing:-.07em;margin:30px 0 0}.kicker,.number{font:10px 'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:#64726c}.panel{padding:65px 0;border-bottom:1px solid #aeb5ad}.settings-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-top:40px}label,input,textarea,select,button{font:12px 'DM Mono',monospace}label{display:grid;gap:10px;color:#64726c;text-transform:uppercase}input,textarea,select{width:100%;border:1px solid #aeb5ad;background:#f1eee7;padding:13px;color:#111817}input[type=color]{height:48px;padding:3px}textarea{min-height:80px;resize:vertical}button{border:0;background:#ff5b1a;color:#111817;padding:14px 18px;cursor:pointer;text-transform:uppercase}.new-project{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:40px 0}article{border-top:1px solid #c1c8c0;padding:22px 0;align-items:center}article>div:first-child{display:grid;grid-template-columns:35px minmax(180px,1fr);gap:9px;flex:1}.project-title{font:20px 'Space Grotesk',sans-serif;border:0;background:transparent;padding:0}.project-actions{display:flex;gap:12px;align-items:center}.upload{display:block;background:#cad1c7;color:#111817;padding:14px 18px;cursor:pointer}.upload input{display:none}.delete{background:transparent;border:1px solid #aeb5ad}.gallery{grid-column:2/-1;display:flex;gap:8px;flex-wrap:wrap}.thumb{position:relative;width:76px;height:76px}.thumb img{width:100%;height:100%;object-fit:cover}.remove-photo{position:absolute;right:2px;top:2px;padding:1px 6px;background:#111817;color:#f1eee7}.message{position:fixed;right:25px;top:25px;background:#111817;color:#f1eee7;padding:16px;z-index:2}@media(max-width:700px){.settings-grid{grid-template-columns:1fr 1fr}.new-project{grid-template-columns:1fr}article{display:block}article>div:first-child{margin-bottom:15px}.project-actions{justify-content:flex-end}}
</style>

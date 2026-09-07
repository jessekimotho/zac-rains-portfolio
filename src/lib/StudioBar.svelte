<script>
	import { onMount } from 'svelte';
	import { defaultSettings, getLocalContent, saveLocalContent, supabase, uploadProjectImage, persistProject, persistProjectImage, deleteProject, deleteProjectImage, saveSettings } from '$lib/content.js';

	let open = false;
	let tab = 'projects';
	/** @type {any} */
	let session = null;
	/** @type {{settings: typeof defaultSettings, projects: any[]}} */
	let content = { settings: { ...defaultSettings }, projects: [] };
	let email = '';
	let password = '';
	let draft = { title: '', description: '', category: 'Selected work', cover_image: '', full_resolution_link: '' };
	let notice = '';
	let busy = false;

	onMount(async () => {
		content = getLocalContent();
		if (!supabase) return;
		const { data } = await supabase.auth.getSession();
		session = data.session;
	});

	/** @param {string} text */
	const notify = (text) => { notice = text; setTimeout(() => (notice = ''), 3500); };

	async function login() {
		if (!supabase) return;
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) return notify(error.message);
		session = data.session;
		await refreshRemote();
	}

	async function logout() { await supabase?.auth.signOut(); session = null; open = false; }

	async function refreshRemote() {
		if (!supabase || !session) return;
		const [{ data: settings }, { data: projects }] = await Promise.all([
			supabase.from('site_settings').select('*').single(),
			supabase.from('projects').select('*, project_images(*)').order('sort_order')
		]);
		if (settings) content.settings = { ...content.settings, accentColor: settings.accent_color, backgroundColor: settings.background_color, paperColor: settings.paper_color, bodyFont: settings.body_font, monoFont: settings.mono_font, imageTreatment: settings.image_treatment };
		if (projects) content.projects = projects;
	}

	async function save() {
		saveLocalContent(content);
		try {
			if (supabase && session) { await saveSettings(content.settings); await Promise.all(content.projects.map(persistProject)); notify('Changes saved to the live site.'); }
			else notify('Saved to this browser preview.');
		} catch (error) { notify(error instanceof Error ? error.message : 'Could not save changes.'); }
	}

	async function addProject() {
		if (!draft.title.trim()) return;
		const project = { ...draft, id: crypto.randomUUID(), published: true, sort_order: content.projects.length };
		content.projects = [...content.projects, project];
		draft = { title: '', description: '', category: 'Selected work', cover_image: '', full_resolution_link: '' };
		if (supabase && session) await persistProject(project);
		await save();
	}

	/** @param {string} id */
	async function removeProject(id) {
		content.projects = content.projects.filter((project) => project.id !== id);
		if (supabase && session) await deleteProject(id);
		await save();
	}

	/** @param {Event} event @param {any} project */
	async function upload(event, project) {
		if (!supabase || !session) return notify('Sign in to upload images.');
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const files = [...(input.files || [])];
		if (!files.length) return;
		busy = true;
		try {
			project.project_images ||= [];
			for (const file of files) {
				const imageUrl = await uploadProjectImage(file, project.id);
				const image = { id: crypto.randomUUID(), image_url: imageUrl, alt_text: project.title, sort_order: project.project_images.length };
				project.project_images = [...project.project_images, image];
				if (!project.cover_image) project.cover_image = imageUrl;
				await persistProjectImage(project.id, imageUrl, image.sort_order);
			}
			await persistProject(project); saveLocalContent(content); notify(`${files.length} photo${files.length === 1 ? '' : 's'} added.`);
		} catch (error) { notify(error instanceof Error ? error.message : 'Upload failed.'); }
		busy = false;
	}

	/** @param {any} project @param {any} image */
	async function removeImage(project, image) {
		project.project_images = (project.project_images || []).filter((/** @type {any} */ item) => item.id !== image.id);
		if (supabase && session) await deleteProjectImage(image.id);
		saveLocalContent(content); notify('Photo removed.');
	}
</script>

<button class="studio-trigger" class:active={open} onclick={() => { open = !open; if (open) refreshRemote(); }} aria-label="Open site studio">{open ? '×' : 'Edit site'}</button>

{#if open}
	<aside class="studio" aria-label="Site studio">
		<div class="studio-head"><div><span class="label">Live review /</span><strong>Site studio</strong></div><div class="head-actions">{#if supabase && session}<button class="quiet" onclick={logout}>Sign out</button>{/if}<button class="quiet" onclick={() => (open = false)}>Close</button></div></div>
		{#if supabase && !session}
			<div class="login"><p>Sign in to edit Zac’s live site.</p><form onsubmit={(event) => { event.preventDefault(); login(); }}><input type="email" placeholder="Email" bind:value={email} required /><input type="password" placeholder="Password" bind:value={password} required /><button>Sign in</button></form><small>Your changes stay private until you save them.</small></div>
		{:else}
			<nav><button class:chosen={tab === 'projects'} onclick={() => (tab = 'projects')}>Portfolio</button><button class:chosen={tab === 'appearance'} onclick={() => (tab = 'appearance')}>Appearance</button></nav>
			{#if tab === 'appearance'}
				<div class="fields"><p class="hint">Adjust the look, then close this panel to review the page underneath.</p><label>Accent colour<input type="color" bind:value={content.settings.accentColor} /></label><label>Background colour<input type="color" bind:value={content.settings.backgroundColor} /></label><label>Paper colour<input type="color" bind:value={content.settings.paperColor} /></label><label>Image treatment<select bind:value={content.settings.imageTreatment}><option value="natural">Natural</option><option value="muted">Muted</option><option value="monochrome">Monochrome</option></select></label><label>Body font<input bind:value={content.settings.bodyFont} /></label><label>Mono font<input bind:value={content.settings.monoFont} /></label><button class="save" onclick={save}>Save appearance</button></div>
			{:else}
				<div class="new"><input placeholder="New project title" bind:value={draft.title} /><input placeholder="Category" bind:value={draft.category} /><input placeholder="Full-resolution folder link" bind:value={draft.full_resolution_link} /><button class="save" onclick={addProject}>+ Add project</button></div>
				<div class="project-list">{#each content.projects as project, index}<section class="project"><div class="project-top"><span class="index">{String(index + 1).padStart(2, '0')}</span><input class="title" bind:value={project.title} /><button class="remove" onclick={() => removeProject(project.id)}>Remove</button></div><input placeholder="Category" bind:value={project.category} /><textarea placeholder="Description" bind:value={project.description}></textarea><input placeholder="Cover image URL" bind:value={project.cover_image} /><input placeholder="Full-resolution folder link" bind:value={project.full_resolution_link} /><label class="published"><input type="checkbox" bind:checked={project.published} /> Visible on site</label>{#if project.project_images?.length}<div class="thumbs">{#each project.project_images as image}<div><img src={image.image_url} alt={image.alt_text || project.title} /><button onclick={() => removeImage(project, image)} aria-label="Remove photo">×</button></div>{/each}</div>{/if}{#if supabase && session}<label class="upload">{busy ? 'Uploading…' : 'Add photos'}<input type="file" accept="image/*" multiple onchange={(event) => upload(event, project)} /></label>{/if}<button class="save project-save" onclick={save}>Save project</button></section>{/each}</div>
			{/if}
			<div class="studio-foot"><span>{supabase && session ? 'Connected to Supabase' : 'Local preview mode'}</span><button class="preview" onclick={() => (open = false)}>Review live page ↗</button></div>
		{/if}
		{#if notice}<div class="notice">{notice}</div>{/if}
	</aside>
{/if}

<style>
	:global(.studio-trigger){position:fixed;right:22px;bottom:22px;z-index:50;border:1px solid rgba(241,238,231,.35);background:#111817;color:#f1eee7;padding:12px 15px;font:10px 'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 10px 30px #0005;transition:.25s}.studio-trigger:hover,.studio-trigger.active{background:#ff5b1a;color:#111817;border-color:#ff5b1a}.studio{position:fixed;right:22px;bottom:72px;z-index:49;width:min(430px,calc(100vw - 28px));max-height:min(760px,calc(100vh - 100px));overflow:auto;background:#e8e4dc;color:#111817;box-shadow:0 22px 70px #0008;border:1px solid #68736c}.studio-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:15px;background:#111817;color:#f1eee7;padding:17px}.label,.index,.studio-foot,.hint,small{font:9px 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#91a09a}.studio-head strong{display:block;font:19px 'Space Grotesk',sans-serif;letter-spacing:-.04em}.head-actions{display:flex;gap:8px}.quiet,.remove,.preview{border:0;background:transparent;color:inherit;font:9px 'DM Mono',monospace;text-transform:uppercase;cursor:pointer}.quiet{color:#aab6b0}.studio nav{display:flex;margin:0;padding:0;border-bottom:1px solid #b8c0b8}.studio nav button{flex:1;border:0;border-right:1px solid #b8c0b8;background:transparent;padding:15px;font:10px 'DM Mono',monospace;text-transform:uppercase;cursor:pointer}.studio nav button.chosen{background:#ff5b1a}.fields,.new,.project-list,.login{padding:17px}.fields,.new,.login{display:grid;gap:10px}.hint{line-height:1.6;text-transform:none;margin:0 0 10px}label{display:grid;gap:7px;font:9px 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#68746e}input,textarea,select{width:100%;border:1px solid #b5bdb4;background:#f1eee7;color:#111817;padding:10px;font:12px 'DM Mono',monospace}input[type=color]{height:37px;padding:2px}input[type=checkbox]{width:auto;accent-color:#ff5b1a}.save{border:0;background:#ff5b1a;color:#111817;padding:11px 13px;font:10px 'DM Mono',monospace;text-transform:uppercase;cursor:pointer}.project{border-top:1px solid #b8c0b8;padding:17px 0;display:grid;gap:9px}.project-top{display:grid;grid-template-columns:25px 1fr auto;gap:8px;align-items:center}.title{font:18px 'Space Grotesk',sans-serif;background:transparent;border:0;padding:0}.remove{color:#9b361b}.published{display:flex;align-items:center;display:flex;flex-direction:row;gap:7px}.thumbs{display:flex;gap:6px;flex-wrap:wrap}.thumbs>div{position:relative;width:58px;height:58px}.thumbs img{width:100%;height:100%;object-fit:cover}.thumbs button{position:absolute;right:1px;top:1px;border:0;background:#111817;color:#f1eee7;cursor:pointer}.upload{background:#cbd2c9;color:#111817;padding:11px;text-align:center;cursor:pointer}.upload input{display:none}.project-save{justify-self:start}.studio-foot{position:sticky;bottom:0;background:#d9d5cc;border-top:1px solid #b8c0b8;padding:13px 17px;display:flex;justify-content:space-between;align-items:center}.preview{color:#9b361b}.notice{position:fixed;right:35px;bottom:85px;background:#111817;color:#f1eee7;padding:13px;font:10px 'DM Mono',monospace;max-width:330px}.login p{font:18px 'Space Grotesk',sans-serif;line-height:1.15;margin:10px 0}.login small{line-height:1.5;text-transform:none}@media(max-width:600px){.studio{right:14px;bottom:64px;max-height:calc(100vh - 80px)}.studio-trigger{right:14px;bottom:14px}}
</style>

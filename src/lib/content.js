import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

export const defaultSettings = {
	accentColor: '#ff5b1a',
	backgroundColor: '#080b0c',
	paperColor: '#f1eee7',
	bodyFont: 'Space Grotesk',
	monoFont: 'DM Mono',
	imageTreatment: 'natural'
};

export const supabase = env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY
	? createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
	: null;

const localKey = 'zac-rains-content-v1';

export function getLocalContent() {
	if (!browser) return { settings: defaultSettings, projects: [] };
	try {
		return JSON.parse(localStorage.getItem(localKey) || '') || { settings: defaultSettings, projects: [] };
	} catch {
		return { settings: defaultSettings, projects: [] };
	}
}

/** @param {any} content */
export function saveLocalContent(content) {
	if (browser) localStorage.setItem(localKey, JSON.stringify(content));
}

export async function loadContent() {
	const local = getLocalContent();
	if (!supabase) return local;
	const [{ data: settings, error: settingsError }, { data: projects, error: projectsError }] = await Promise.all([
		supabase.from('site_settings').select('*').single(),
		supabase.from('projects').select('*, project_images(*)').eq('published', true).order('sort_order')
	]);
	if (settingsError || projectsError) throw settingsError || projectsError;
	return {
		settings: { ...local.settings, accentColor: settings.accent_color, backgroundColor: settings.background_color, paperColor: settings.paper_color, bodyFont: settings.body_font, monoFont: settings.mono_font, imageTreatment: settings.image_treatment },
		projects: projects || []
	};
}

/** @param {any} settings */
export async function saveSettings(settings) {
	if (!supabase) return;
	const { error } = await supabase.from('site_settings').upsert({
		id: true, accent_color: settings.accentColor, background_color: settings.backgroundColor,
		paper_color: settings.paperColor, body_font: settings.bodyFont, mono_font: settings.monoFont,
		image_treatment: settings.imageTreatment, updated_at: new Date().toISOString()
	});
	if (error) throw error;
}

/** @param {any} project */
export async function persistProject(project) {
	if (!supabase) return;
	const { error } = await supabase.from('projects').upsert({
		id: project.id, title: project.title, description: project.description || '', category: project.category || '',
		cover_image: project.cover_image || '', full_resolution_link: project.full_resolution_link || '',
		published: project.published !== false, sort_order: project.sort_order || 0, updated_at: new Date().toISOString()
	});
	if (error) throw error;
}

/** @param {string} id */
export async function deleteProject(id) {
	if (!supabase) return;
	const { error } = await supabase.from('projects').delete().eq('id', id);
	if (error) throw error;
}

/** @param {string} projectId @param {string} imageUrl @param {number} sortOrder */
export async function persistProjectImage(projectId, imageUrl, sortOrder) {
	if (!supabase) return;
	const { error } = await supabase.from('project_images').insert({ project_id: projectId, image_url: imageUrl, sort_order: sortOrder });
	if (error) throw error;
}

/** @param {string} id */
export async function deleteProjectImage(id) {
	if (!supabase) return;
	const { error } = await supabase.from('project_images').delete().eq('id', id);
	if (error) throw error;
}

/** @param {File} file @param {string} projectId */
export async function uploadProjectImage(file, projectId) {
	if (!supabase) throw new Error('Supabase is not configured yet. Add the public environment variables first.');
	const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
	const path = `${projectId}/${crypto.randomUUID()}.${extension}`;
	const { error } = await supabase.storage.from('portfolio-images').upload(path, file, {
		cacheControl: '31536000',
		upsert: false,
		contentType: file.type
	});
	if (error) throw error;
	const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
	return data.publicUrl;
}

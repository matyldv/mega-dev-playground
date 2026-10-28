import { mount } from 'svelte';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const route = window.location.pathname.replace(/\/+$/, '') || '/kb';
const page = pages[`/src/routes${route}/+page.svx`];
if (page) {
  mount(page.default, { target: document.getElementById('app') });
} else {
  document.getElementById('app').textContent = 'Page not found. Start at /kb.';
}

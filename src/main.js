import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';

import './app.css';
import App from './App.svelte';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const app = new App({
	target: document.body,
});

export default app;
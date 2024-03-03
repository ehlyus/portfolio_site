<!-- Gallery.svelte -->
<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import * as THREE from 'three';
    import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

    let galleryContainer;

    onMount(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        galleryContainer.appendChild(renderer.domElement);

        // Load the Sketchfab model
        const loader = new GLTFLoader();
        loader.load('path/to/your/model.gltf', (gltf) => {
            scene.add(gltf.scene);
        });

        // Set up GSAP scroll trigger or any other animations
        // Example:
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: galleryContainer,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        // Define animations
        tl.to(camera.position, {
            duration: 1,
            z: -10, // Move the camera forward
            ease: 'power1.inOut'
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    });
</script>

<div class="gallery-container" bind:this={galleryContainer}></div>

<style>
    .gallery-container {
        width: 100%;
        height: 100vh;
        position: relative;
    }
</style>

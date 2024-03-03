<!-- Gallery.svelte -->
<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import * as THREE from 'three';
    import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
    import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

    let galleryContainer;

    onMount(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        galleryContainer.appendChild(renderer.domElement);

        const controls = new OrbitControls( camera, renderer.domElement);

        const loader = new GLTFLoader();
        loader.load('src/assets/art_gallery__zen__baked/scene.gltf', (gltf) => {
            gltf.scene.position.set(0,-1,-4)
            scene.add(gltf.scene);
        });

        camera.position.z = 0;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
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

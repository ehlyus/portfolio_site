<!-- Gallery.svelte -->
<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

    let galleryContainer;
    let cameraPosition = { x: 0, y: 0, z: 0 };
    let targetPosition = { x: 0, y: 0, z: 0 };
    let camera;
    let controls;
    const positionToString = (position) => {
        return `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`;
    };

    onMount(() => {
        const renderer = new THREE.WebGLRenderer();
        const scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        renderer.setSize(window.innerWidth, window.innerHeight);
        galleryContainer.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        // Set initial camera position and target
        camera.position.set(0.45, 1.25, 3.46);
        controls.target.set(6.83, 1.26, -4.12);
        controls.update()

        const loader = new GLTFLoader();
        loader.load('src/assets/art_gallery__zen__baked/scene.gltf', (gltf) => {
            scene.add(gltf.scene);
        }, undefined, function ( error ) {
            console.error( error );
        } );

        // Create orb geometry and material
        const orbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const orbMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for the orb

        // Create orb mesh
        const controlOrb = new THREE.Mesh(orbGeometry, orbMaterial);
        scene.add(controlOrb); // Add orb to the scene


        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls before rendering
            controls.update();
            cameraPosition = { ...camera.position };
            targetPosition = { ...controls.target };

            // Position the orb at the controls target
            // controlOrb.position.copy(controls.target);

            renderer.render(scene, camera);
        };

        animate();
    });
</script>

<div class="gallery-container" bind:this={galleryContainer}>
    <p style="color: red">Camera Position: { positionToString(cameraPosition) }</p>
    <p style="color: red">Target Position: {positionToString(targetPosition) }</p>
</div>

<style>
    .gallery-container {
        width: 100%;
        height: 100vh;
        position: relative;
    }
</style>

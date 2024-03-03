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
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // Set white background
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        renderer.toneMapping = THREE.ReinhardToneMapping; // Adjust tone mapping algorithm
        renderer.toneMappingExposure = 3; // Increase exposure for brighter scene
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio( window.devicePixelRatio );

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

        // Add ambient light to brighten up the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Increase intensity to brighten the scene
        scene.add(ambientLight);

        // Add directional light to simulate sunlight from above
        const sunlight = new THREE.DirectionalLight(0xffffff, 5); // Increased intensity to 5
        sunlight.position.set(0, 1, 0); // Set position above the scene
        sunlight.castShadow = true; // Enable shadow casting
        scene.add(sunlight);

        // Set up shadow properties for the light
        sunlight.shadow.mapSize.width = 8192; // Increase shadow map size for higher quality
        sunlight.shadow.mapSize.height = 8192;
        sunlight.shadow.camera.near = 0.5; // Near plane of the shadow camera
        sunlight.shadow.camera.far = 100; // Far plane of the shadow camera

        // Set up shadow camera parameters for better quality
        sunlight.shadow.camera.left = -40;
        sunlight.shadow.camera.right = 40;
        sunlight.shadow.camera.top = 40;
        sunlight.shadow.camera.bottom = -40;

        // Set shadow bias to reduce self-shadowing artifacts
        sunlight.shadow.bias = -0.0005;

        // Enable shadow receiving for objects
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows for smoother appearance

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls before rendering
            controls.update();
            cameraPosition = { ...camera.position };
            targetPosition = { ...controls.target };

            // Position the orb at the controls target
            // controlOrb.position.copy(controls.target);

            renderer.setSize(window.innerWidth, window.innerHeight); // Adjust renderer size based on window size
            camera.aspect = window.innerWidth / window.innerHeight; // Adjust camera aspect ratio
            camera.updateProjectionMatrix(); // Update camera projection matrix

            renderer.render(scene, camera);
        };

        animate();
    });
</script>

<div class="gallery-container" bind:this={galleryContainer}>
    <p style="color: white; float: left;"> Target Position: <span style="color: red;">{positionToString(targetPosition)} |</span></p>
    <p style="color: white; float: left;"> Camera Position: <span style="color: red;"> {positionToString(cameraPosition)}</span></p>
</div>

<style>
    .gallery-container {
        width: 100%;
        height: 100vh;
        position: relative;
    }
</style>

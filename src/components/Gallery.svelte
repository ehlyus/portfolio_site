<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { Sky } from "three/examples/jsm/objects/Sky";
    import GUI from "three/examples/jsm/libs/lil-gui.module.min";

    let galleryContainer;
    let cameraPosition = { x: 0, y: 0, z: 0 };
    let targetPosition = { x: 0, y: 0, z: 0 };
    let camera, scene, renderer;
    let sky, sun;
    let controls;
    const positionToString = (position) => {
        return `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`;
    };

    function initSky() {
        sky = new Sky();
        sky.scale.setScalar( 450000 );
        scene.add( sky );

        sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 12.6, // Adjust sun's elevation
            azimuth: 180,
            exposure: 1.0
        };

        function guiChanged() {
            const uniforms = sky.material.uniforms;
            uniforms.turbidity.value = effectController.turbidity;
            uniforms.rayleigh.value = effectController.rayleigh;
            uniforms.mieCoefficient.value = effectController.mieCoefficient;
            uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
            const theta = THREE.MathUtils.degToRad( effectController.azimuth );

            sun.setFromSphericalCoords( 1, phi, theta );

            uniforms.sunPosition.value.copy( sun );

            renderer.toneMappingExposure = effectController.exposure;
            renderer.render( scene, camera );
        }

        const gui = new GUI();

        gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
        gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
        gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

        guiChanged();
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        galleryContainer.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(3.66, 0.83, 14.38);
        controls.target.set(0.34, 2.56, -0.37);
        controls.update();

        const loader = new GLTFLoader();
// Define an array of node names to exclude from casting shadows
        const exclusionArray = ["suspended structure",
            "cilling_cable", "Mesh001", "Mesh001_1", "Mesh002", "Mesh002_1", "Mesh002_2", "Mesh003", "Mesh003_1", "Mesh004"];

        loader.load('src/assets/untitled.glb', (gltf) => {
            scene.add(gltf.scene);

            // Improve lighting
            gltf.scene.traverse(node => {
                if (node.isMesh && !exclusionArray.includes(node.name)) { // Check if the node is a Mesh and not in the exclusion array
                    // Enable soft shadows
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
        }, undefined, function (error) {
            console.error('Error loading GLB file:', error);
        });


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Adjust ambient light intensity
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1); // Adjust directional light intensity
        dirLight.position.set(10, 10, 10); // Adjust light position
        dirLight.castShadow = true; // Enable shadow casting
        scene.add(dirLight);

        // Set up shadow properties
        dirLight.shadow.mapSize.width = 2048; // Increase shadow map resolution
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;

        // Enable ambient occlusion
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soften shadow edges

        initSky();

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            cameraPosition = camera.position.clone();
            targetPosition = controls.target.clone();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
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

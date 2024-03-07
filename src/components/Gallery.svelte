<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { Sky } from "three/examples/jsm/objects/Sky";
    import GUI from "three/examples/jsm/libs/lil-gui.module.min";
    import { gsap } from 'gsap';
    import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
    import {Clock} from "three";

    let galleryContainer;
    let cameraPosition = { x: 0, y: 0, z: 0 };
    const clock = new Clock()
    // let targetPosition = { x: 0, y: 0, z: 0 };
    let camera, scene, renderer;
    let sky, sun;
    // let controls;
    const positionToString = (position) => {
        return `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`;
    };

    function initSky() {
        sky = new Sky();
        sky.scale.setScalar( 450000 );
        scene.add( sky );

        sun = new THREE.Vector3();

        const effectController = {
            turbidity: 2.3,
            rayleigh: 1.1,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 8, // Adjust sun's elevation
            azimuth: 39,
            exposure: 2
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
        gui.add( effectController, 'exposure', 0, 2, 0.0001 ).onChange( guiChanged ); // Adjusted maximum exposure

        guiChanged();
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable anti-aliasing
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        galleryContainer.appendChild(renderer.domElement);

        // controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set( 3.98, 4.07, 11.79);
        // controls.target.set(0.34, 2.56, -0.37);
        // controls.update();
        // const controls = new FirstPersonControls(camera, renderer.domElement);
        // controls.movementSpeed = 8;
        // controls.lookSpeed = 0.08;

        const loader = new GLTFLoader();
        loader.load('src/assets/untitled.glb', (model) => {
            // Add the model to the scene
            scene.add(model.scene);
            window.addEventListener('mouseup', () => {
                // console.log(camera.position);
                gsap.to(camera.position, {
                    x: -4.5, y: 1.439498279696612, z: 7.5,
                    duration: 3
                });
                gsap.to(camera.rotation, {
                    x: 0,
                    y: -.62,
                    z: 0,
                    duration: 3.3
                })
            });
        }, undefined, function (error) {
            console.error('Error loading GLB file:', error);
        });
        console.log(scene)

        // Increase ambient light intensity
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        // Adjust directional light intensity and position
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Set up shadow properties for directional light
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 50;

        // Change shadow map type for smoother shadows

        // Enable ambient occlusion
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soften shadow edges

        initSky();

        const animate = () => {
            requestAnimationFrame(animate);
            cameraPosition = camera.position.clone();
            renderer.render(scene, camera);
            // controls.update(clock.getDelta());
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
    <!--    <p style="color: white; float: left;"> Target Position: <span style="color: red;">{positionToString(targetPosition)} |</span></p>-->
    <p style="color: white; float: left;"> Camera Position: <span style="color: red;"> {positionToString(cameraPosition)}</span></p>
    <!-- HTML markup -->
    <button id="animateButton">Animate Suspended Structure</button>

</div>

<style>
    .gallery-container {
        width: 100%;
        height: 100vh;
        position: relative;
    }
</style>

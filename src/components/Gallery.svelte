<script lang="ts">
    // @ts-nocheck
    import {onMount} from 'svelte';
    import * as THREE from 'three';
    import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
    import {Sky} from "three/examples/jsm/objects/Sky";
    import GUI from "three/examples/jsm/libs/lil-gui.module.min";
    import {gsap} from 'gsap';

    let galleryContainer;
    let cameraPosition = {x: 0, y: 0, z: 0};
    let camera, scene, renderer;
    let sky, sun;
    let tvUi;
    const clock = new THREE.Clock();
    let displayInView = false;
    let initialized = false;
    let tvScreenPosition, tvScreenWidth, tvScreenHeight; // Initialize here

    const positionToString = (position) => {
        return `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`;
    };

    function initSky() {
        sky = new Sky();
        sky.scale.setScalar(450000);
        scene.add(sky);

        sun = new THREE.Vector3();

        const effectController = {
            turbidity: 2.3,
            rayleigh: 1.1,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 8,
            azimuth: 39,
            exposure: 2
        };

        function guiChanged() {
            const uniforms = sky.material.uniforms;
            uniforms.turbidity.value = effectController.turbidity;
            uniforms.rayleigh.value = effectController.rayleigh;
            uniforms.mieCoefficient.value = effectController.mieCoefficient;
            uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
            const theta = THREE.MathUtils.degToRad(effectController.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            uniforms.sunPosition.value.copy(sun);

            renderer.toneMappingExposure = effectController.exposure;
            renderer.render(scene, camera);
        }

        const gui = new GUI();

        for (const key in effectController) {
            gui.add(effectController, key).onChange(guiChanged);
        }

        guiChanged();
    }

    function positionCanvasOverTv() {
        if (tvUi && !initialized) {
            const tvScreenPositionCSS = tvScreenPosition.project(camera);
            const x = (tvScreenPositionCSS.x + 1) / 2 * window.innerWidth;
            const y = (-tvScreenPositionCSS.y + 1) / 2 * window.innerHeight;

            const uiCanvas = document.getElementById('ui-canvas');

            if (uiCanvas) {

                uiCanvas.style.position = 'absolute';
                uiCanvas.style.left = x + 'px';
                uiCanvas.style.top = y + 'px';
                uiCanvas.width = tvScreenWidth * window.innerWidth;
                uiCanvas.height = tvScreenHeight * window.innerHeight;

                initialized = true;
            }
        }
    }


    function animate() {
        requestAnimationFrame(animate);
        cameraPosition = camera.position.clone();
        displayInView = camera.position.x === -4.57 && camera.position.y === 1.40 && camera.position.z === 7.20;
        positionCanvasOverTv();
        renderer.render(scene, camera);
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function modelLoadedCallback() {
        setTimeout(() => {
            gsap.to(camera.position, {
                x: -4.57,
                y: 1.40,
                z: 7.2,
                duration: 2.7
            });
            gsap.to(camera.rotation, {
                x: 0,
                y: -.62,
                z: 0,
                duration: 2.75
            })
        }, 650)
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({antialias: true});
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        displayInView = true;

        galleryContainer.appendChild(renderer.domElement);

        camera.position.set(3.98, 4.07, 11.79);

        const loader = new GLTFLoader();
        loader.load('src/assets/untitled.glb', (model) => {
            scene.add(model.scene);
            tvUi = model.scene.children.find(child => child.name === "SM_tv_screen_led_");

            tvScreenPosition = tvUi.position.clone();
            tvScreenWidth = tvUi.scale.x;
            tvScreenHeight = tvUi.scale.y;

            modelLoadedCallback();
        }, undefined, function (error) {
            console.error('Error loading GLB file:', error);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 50;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        initSky();

        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<div class="gallery-container" bind:this={galleryContainer}>
    {#if displayInView}
        <div id="ui-canvas">
            <p> perfect :)</p>
        </div>
    {/if}
    <p style="color: white; float: left;"> Camera Position: <span
            style="color: red;"> {positionToString(cameraPosition)}</span></p>
</div>

<style>
    .gallery-container {
        width: 100%;
        height: 100vh;
        position: relative;
    }

    #ui-canvas {
        display: block;
        background: grey;
        position: absolute !important;
        top: 103px !important;
        left: 173.5px !important;
        width: 1152px !important;
        height: 695px !important;
    }
</style>

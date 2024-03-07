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

        gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
        gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
        gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
        gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
        gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
        gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
        gui.add(effectController, 'exposure', 0, 2, 0.0001).onChange(guiChanged);

        guiChanged();
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({antialias: true});
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        galleryContainer.appendChild(renderer.domElement);

        camera.position.set(3.98, 4.07, 11.79);

        const loader = new GLTFLoader();
        loader.load('src/assets/untitled.glb', (model) => {
            scene.add(model.scene);
            console.log(model.scene)
            tvUi = model.scene.children.filter(child => child.name === "SM_tv_screen_led_")[0];
            console.log(tvUi);

// Get the position and dimensions of the TV screen
            const tvScreenPosition = tvUi.position.clone();
            const tvScreenWidth = tvUi.scale.x;
            const tvScreenHeight = tvUi.scale.y;

// Position the UI canvas over the TV screen
            const uiCanvas = document.getElementById('ui-canvas');
            const uiContext = uiCanvas.getContext('2d');

// Calculate the position of the TV screen in CSS coordinates
            const tvScreenPositionCSS = tvScreenPosition.project(camera);
            const x = (tvScreenPositionCSS.x + 1) / 2 * window.innerWidth;
            const y = (-tvScreenPositionCSS.y + 1) / 2 * window.innerHeight;

// Position the canvas over the TV screen
            uiCanvas.style.position = 'absolute';
            uiCanvas.style.left = x + 'px';
            uiCanvas.style.top = y + 'px';
            uiCanvas.width = tvScreenWidth * window.innerWidth; // Set canvas width to match TV screen width
            uiCanvas.height = tvScreenHeight * window.innerHeight; // Set canvas height to match TV screen height

// Example:
            uiContext.fillStyle = 'red';
            uiContext.fillRect(0, 0, uiCanvas.width, uiCanvas.height);
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

        const animate = () => {
            requestAnimationFrame(animate);
            cameraPosition = camera.position.clone();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const modelLoadedCallback = () => {
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
                setTimeout(() => {
                        document.getElementById('ui-canvas').style.display = 'block';
                    },
                    2800)
            }, 650)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<div class="gallery-container" bind:this={galleryContainer}>
    <canvas id="ui-canvas"></canvas>
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
        display: none;
        position: absolute !important;
        top: 103px !important;
        left: 48px !important;
        width: 1152px !important;
        height: 695px !important;
    }
</style>


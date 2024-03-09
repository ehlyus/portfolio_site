<div class="gallery-container" bind:this={galleryContainer}>
    {#if displayInView}
        <div id="ui-canvas" data-theme="cupcake" class="hero welcome-container" bind:this={uiCanvas}>
            <div class="hero-content welcome-content flex-col lg:flex-row-reverse">
                <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                     class="max-w-lg rounded-lg shadow-2xl"/>
                <div>
                    <h1 class="text-5xl font-bold">Welcome!</h1>
                    <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                        exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    <button data-theme="cupcake" class="btn btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    {/if}
</div>
<script lang="ts">
    // @ts-nocheck
    import {onMount} from 'svelte';
    import * as THREE from 'three';
    import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
    import {Sky} from "three/examples/jsm/objects/Sky";
    import GUI from "three/examples/jsm/libs/lil-gui.module.min";
    import {gsap} from 'gsap';
    import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";

    let galleryContainer;
    let cameraPosition = {x: 0, y: 0, z: 0};
    let camera, scene, renderer, controls;
    let sky, sun;
    let tvUi;
    const clock = new THREE.Clock();
    let displayInView = false;
    let uiCanvas;
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

        guiChanged();
    }

    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function modelLoadedCallback() {
        setTimeout(() => {
            gsap.to(camera.position, {
                x: -4.44,
                y: 1.435,
                z: 7.02,
                duration: 2.2
            });
            gsap.to(camera.rotation, {
                x: 0,
                y: -.615,
                z: 0,
                duration: 2.25
            })
            setTimeout(() => {
                console.log(uiCanvas)

                // uiCanvas.style.width = '100vw';
                // uiCanvas.style.height = '100vw';
                gsap.to(uiCanvas, {
                    width: "100vw",
                    height: "100vh",
                    duration: .05
                });
                uiCanvas.style.borderRadius = '0px';
            }, 2500)
        }, 650)
    }

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta(); // Add delta time
        // controls.update(delta); // Update controls
        cameraPosition = camera.position.clone();
        displayInView = camera.position.x === -4.44 && camera.position.y === 1.435 && camera.position.z === 7.02;
        // console.log(cameraPosition)
        renderer.render(scene, camera);
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

        camera.position.set(3.5, 4.07, 12.79);
        // camera.position.set(-4.44, 1.435, 7.02);
        // camera.rotation.set(0, -.615, 0);

        // controls = new FirstPersonControls(camera, document.body); // Initialize PointerLockControls
        // scene.add(controls);
        const loader = new GLTFLoader();
        loader.load('src/assets/untitled.glb', (model) => {
            scene.add(model.scene);
            tvUi = model.scene.children.find(child => child.name === "SM_tv_screen_led_");
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

<style style lang="postcss">
    .welcome-content {
        flex-direction: row !important;
    }
    .welcome-container {
        background-image:
                radial-gradient(circle at 47% 14%,
                    rgba(205, 205, 205, 0.04) 0%,
                    rgba(205, 205, 205, 0.04) 43%, transparent 43%, transparent 100%),
                radial-gradient(circle at 35% 12%,
                    rgba(215, 215, 215, 0.04) 0%,
                    rgba(215, 215, 215, 0.04) 4%, transparent 4%, transparent 100%),
                radial-gradient(circle at 1% 35%,
                    rgba(24, 24, 24, 0.04) 0%,
                    rgba(24, 24, 24, 0.04) 37%, transparent 37%, transparent 100%),
                radial-gradient(circle at 21% 1%,
                    rgba(0, 0, 0, 0.04) 0%,
                    rgba(0, 0, 0, 0.04) 26%, transparent 26%, transparent 100%),
                radial-gradient(circle at 23% 82%,
                    rgba(249, 249, 249, 0.04) 0%,
                    rgba(249, 249, 249, 0.04) 60%, transparent 60%, transparent 100%),
                radial-gradient(circle at 11% 54%,
                    rgba(251, 251, 251, 0.04) 0%,
                    rgba(251, 251, 251, 0.04) 23%, transparent 23%, transparent 100%),
                radial-gradient(circle at 69% 68%,
                    rgba(234, 234, 234, 0.04) 0%,
                    rgba(234, 234, 234, 0.04) 10%, transparent 10%, transparent 100%),
                linear-gradient(90deg, oklch(var(--b1)), oklch(var(--b2)));
    }

    .gallery-container {
        width: 100%;
        height: 100%;
        position: relative;
    }

    #ui-canvas {
        display: grid;
        position: fixed !important;
        height: 90%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30%;
        border-radius: 12px;
    }

    @media (max-width: 1400px) {
        #ui-canvas {
            width: 95%;
        }
    }

    @media (min-width: 1401px) and (max-width: 1600px) {
        #ui-canvas {
            width: 89%;
        }
    }

    /*@media(min-width: 1481px) and (max-width: 1620px) {*/
    /*    #ui-canvas {*/
    /*        width: 85% !important;*/
    /*    }*/
    /*}*/
    @media (min-width: 1601px) and (max-width: 1660px) {
        #ui-canvas {
            width: 86%;
        }
    }

    @media (min-width: 1661px) and (max-width: 1770px) {
        #ui-canvas {
            width: 80%;
        }
    }

    @media (min-width: 1770px) and (max-width: 1830px) {
        #ui-canvas {
            width: 79%;
        }
    }

    @media (min-width: 1830px) and (max-width: 1920px) {
        #ui-canvas {
            width: 77%;
            height: 97%;
        }
    }

    @media (min-width: 1941px) and (max-width: 1990px) {
        #ui-canvas {
            width: 73%;
        }
    }

    @media (min-width: 1991px) and (max-width: 2050px) {
        #ui-canvas {
            width: 71%;
        }
    }

    @media (min-width: 2051px) and (max-width: 2100px) {
        #ui-canvas {
            width: 69%;
        }
    }

    @media (min-width: 2101px) and (max-width: 2230px) {
        #ui-canvas {
            width: 65%;
        }
    }

    @media (min-width: 2231px) and (max-width: 2350px) {
        #ui-canvas {
            width: 62%;
        }
    }

    @media (min-width: 2351px) and (max-width: 2400px) {
        #ui-canvas {
            width: 60%;
        }
    }


</style>

<svelte:head>
    <title>Elijah Johnson - Personal Website</title>
    <meta name="description" content="Svelte portfolio site"/>
</svelte:head>

<div id="smooth-wrapper" bind:this={main}>
    <div id="smooth-content">
        <header class="header">
            <h1 class="title">Elijah Johnson's Personal Website</h1>
            <button class="button jump-to" on:click={scrollTo}> Jump to C</button>
        </header>
        <div class="box box-a" data-speed="1" style="width: 600px !important; height: 150px !important;">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 x="0px" y="0px" width="570px" height="150px" viewBox="0 0 570 150" xml:space="preserve">
                <circle fill="none" cx="71.5" cy="77.5" r="51.5" stroke="#88CE02" stroke-width="4"/>
                <ellipse fill="none" stroke="#88CE02" stroke-width="4" stroke-miterlimit="10" cx="241.4" cy="77.5"
                         rx="78.9" ry="51.5"/>

                <rect x="354" y="26" fill="none" stroke="#88CE02" stroke-linecap="square" stroke-width="4"
                      stroke-miterlimit="30" width="103" height="103" id="rect"/>
                <polyline fill="none" stroke="#88CE02" stroke-width="4" stroke-miterlimit="10"
                          points="536.1,129 487.3,74.2 536.1,26 "/>
            </svg>
        </div>
        <div class="box box-b" data-speed="1">b</div>
        <div class="box box-c" data-speed="1">c</div>
        <div class="line"/>
    </div>
</div>
<footer>

</footer>

<script lang="ts">
    import {onMount} from "svelte";
    import {gsap} from "gsap";
    import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
    import {ScrollSmoother} from "gsap/dist/ScrollSmoother";

    /**
     * @type {globalThis.ScrollSmoother}
     */
    let main: any, smoother: ScrollSmoother;

    const scrollTo = () => {
        smoother && smoother.scrollTo(".box-c", true, "center center");
    };

    onMount(() => {
        const ctx = gsap.context(() => {
            smoother = ScrollSmoother.create({
                smooth: 2.5, // seconds it takes to "catch up" to native scroll position
                effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
            });
            ScrollTrigger.create({
                trigger: ".box-a",
                pin: true,
                start: "bottom center",
                end: "+=1000",
                markers: true,
            });
            ScrollTrigger.create({
                trigger: ".box-b",
                pin: true,
                start: "top center",
                end: "+=1000",
                markers: true,
            });
            ScrollTrigger.create({
                trigger: ".box-c",
                pin: true,
                start: "top center",
                end: "+=1000",
                markers: true,
            });
            gsap.from('.title', {
                opacity: 0,
                y: -50,
                duration: 1,
                delay: 0.5
            });
            gsap.from('.box-a', {
                opacity: 0,
                y: -50,
                duration: 1,
                delay: 0.5
            });
            gsap.from('.jump-to', {
                opacity: 0,
                y: -50,
                duration: 1,
                delay: 0.5
            });

        }, main); // <- Scope!
        let shapes = "rect, circle, ellipse, polyline",
            tl = gsap.timeline({repeat: 1, yoyo: true});

        tl.fromTo(shapes, {drawSVG: "100%"}, {duration: 1, drawSVG: "50% 50%", stagger: 0.1})
            .fromTo(shapes, {drawSVG: "0%"}, {duration: 0.1, drawSVG: "10%", immediateRender: false}, "+=0.1")
            .to(shapes, {duration: 1, drawSVG:"90% 100%", stagger: 0.5})

        return () => ctx.revert(); // <- Cleanup!
    });
</script>
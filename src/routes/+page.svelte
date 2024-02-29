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
                smooth: 2, // seconds it takes to "catch up" to native scroll position
                effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
            });
            ScrollTrigger.create({
                trigger: ".box-c",
                pin: true,
                start: "center center",
                end: "+=300",
                markers: true,
            });
        }, main); // <- Scope!

        return () => ctx.revert(); // <- Cleanup!
    });
</script>

<svelte:head>
    <title>Elijah Johnson - Personal Website</title>
    <meta name="description" content="Svelte demo app"/>
</svelte:head>

<div id="smooth-wrapper" bind:this={main}>
    <div id="smooth-content">
        <header class="header">
            <h1 class="title">Elijah Johnson's Personal Website</h1>
            <button class="button" on:click={scrollTo}> Jump to C</button>
        </header>
        <div class="box box-a" data-speed="0.5">a</div>
        <div class="box box-b" data-speed="0.8">b</div>
        <div class="box box-c" data-speed="1.5">c</div>
        <div class="line"/>
    </div>
</div>
<footer>

</footer>
    
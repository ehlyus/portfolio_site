<svelte:head>
    <title>Elijah Johnson - Personal Website</title>
    <meta name="description" content="SvelteKit portfolio site"/>
</svelte:head>

<div id="smooth-wrapper" bind:this={main}>
    <div id="smooth-content">
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
        smoother
    };

    onMount(() => {
        const ctx = gsap.context(() => {
            smoother = ScrollSmoother.create({
                smooth: 2, // seconds it takes to "catch up" to native scroll position
                effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
            });

        }, main); // <- Scope!

        return () => ctx.revert(); // <- Cleanup!
    });
</script>
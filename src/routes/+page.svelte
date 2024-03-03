<svelte:head>
    <title>Elijah Johnson - Personal Website</title>
    <meta name="description" content="SvelteKit portfolio site"/>
</svelte:head>

<div id="smooth-wrapper" bind:this={main}>
    <div id="smooth-content">
        <Room roomName="Patio" />
        <Room roomName="RoomA  " />
        <Room roomName="RoomB" />
    </div>

</div>
<footer>

</footer>

<script lang="ts">
    import {onMount} from "svelte";
    import {gsap} from "gsap";
    import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
    import Room from '../components/Room.svelte';
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
        const rooms = document.querySelectorAll('.room');

        rooms.forEach((room, index) => {
            gsap.to(room, {
                opacity: 0,
                scrollTrigger: {
                    trigger: room,
                    start: 'top bottom', // Animation starts when the top of the room hits the bottom of the viewport
                    end: 'bottom top', // Animation ends when the bottom of the room hits the top of the viewport
                    scrub: true // Smooth animation while scrolling
                }
            });
        });

        return () => ctx.revert(); // <- Cleanup!
    });
</script>
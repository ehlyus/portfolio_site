<svelte:head>
    <title>Elijah Johnson - Personal Website</title>
    <meta name="description" content="SvelteKit portfolio site"/>
</svelte:head>
<Gallery />
<footer>

</footer>

<script lang="ts">
    import {onMount} from "svelte";
    import {gsap} from "gsap";
    import Gallery from "../components/Gallery.svelte";

    /**
     * @type {globalThis.ScrollSmoother}
     */
    let main: any

    onMount(() => {
        return;
    });
</script>
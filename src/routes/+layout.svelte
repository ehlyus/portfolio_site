<script>
  import gsap from "gsap-trial";
  import ScrollTrigger from "gsap-trial/dist/ScrollTrigger";
  import ScrollSmoother from "gsap-trial/dist/ScrollSmoother";
	import './styles.css';
	
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  }
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

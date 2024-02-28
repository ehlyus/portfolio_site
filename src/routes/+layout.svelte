<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { ScrollSmoother } from "gsap/dist/ScrollSmoother";
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

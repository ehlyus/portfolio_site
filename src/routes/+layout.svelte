<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
  import { ScrollSmoother } from "gsap/dist/ScrollSmoother";
  import { DrawSVGPlugin } from "gsap/dist/DrawSVGPlugin";
  import "../app.pcss";
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin);
  }
</script>

<div class="app">
	<main>
		<slot></slot>
	</main>
</div>

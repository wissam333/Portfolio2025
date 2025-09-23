<template>
  <img
    ref="imageParticleRef"
    :src="imageSrc"
    class="particle-image"
    :data-particle-gap="particleGap"
    :data-width="canvasWidth"
    :data-height="canvasHeight"
    :data-gravity="gravity"
    :data-particle-size="particleSize"
    :data-mouse-force="mouseForce"
    :data-renderer="renderer"
    :data-color="color"
    :data-color-arr="colorArr"
    :data-init-position="initPosition"
    :data-init-direction="initDirection"
    :data-fade-position="fadePosition"
    :data-fade-direction="fadeDirection"
    :data-noise="noise"
    :data-responsive-width="true"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import {
  inspiraImageParticles,
  type InspiraImageParticle,
} from "./inspiraImageParticles";
import { cn } from "@/lib/utils";

type ParticleImageProps = {
  imageSrc: string;
  class?: string;
  gravity?: string;
  particleSize?: string;
  particleGap?: string;
  mouseForce?: string;
  renderer?: "default" | "webgl";
  color?: string;
  colorArr?: number[];
  initPosition?: string;
  initDirection?: string;
  fadePosition?: string;
  fadeDirection?: string;
  noise?: number;
};

defineProps<ParticleImageProps>();

const imageParticleRef = ref<HTMLImageElement>();
let particles: InspiraImageParticle;

// Make responsive width & height
const canvasWidth = computed(() => (window.innerWidth < 768 ? "250" : "600"));
const canvasHeight = computed(() => (window.innerWidth < 768 ? "200" : "600")); // smaller height on mobile

onMounted(() => {
  const { InspiraImageParticle } = inspiraImageParticles();
  particles = new InspiraImageParticle(imageParticleRef.value);
});
</script>

<style scoped>
.particle-image {
  width: 100%;
  height: auto; /* keeps aspect ratio */
  display: block;
  margin: 0 auto;
}
</style>

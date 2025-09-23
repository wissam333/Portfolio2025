<template>
  <img
    ref="imageParticleRef"
    :src="imageSrc"
    :class="cn('particle-image', $props.class)"
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
import { cn } from "@/lib/utils";
import {
  inspiraImageParticles,
  type InspiraImageParticle as ImageParticle,
} from "./inspiraImageParticles";
import { ref, onMounted, computed } from "vue";

type ParticleImageProps = {
  imageSrc: string;
  class?: string;
  canvasWidth?: string;
  canvasHeight?: string;
  gravity?: string;
  particleSize?: string;
  particleGap?: string;
  mouseForce?: string;
  renderer?: "default" | "webgl";
  color?: string;
  colorArr?: number[];
  initPosition?: "random" | "top" | "left" | "bottom" | "right" | "misplaced" | "none";
  initDirection?: "random" | "top" | "left" | "bottom" | "right" | "none";
  fadePosition?: "explode" | "top" | "left" | "bottom" | "right" | "random" | "none";
  fadeDirection?: "random" | "top" | "left" | "bottom" | "right" | "none";
  noise?: number;
  responsiveWidth?: boolean;
};

defineProps<ParticleImageProps>();

const imageParticleRef = ref<HTMLImageElement>();
let particles: ImageParticle;

// Make width and height responsive
const canvasWidth = computed(() => window.innerWidth < 768 ? "100%" : "600");
const canvasHeight = computed(() => window.innerWidth < 768 ? "auto" : "600");

onMounted(() => {
  const { InspiraImageParticle } = inspiraImageParticles();
  particles = new InspiraImageParticle(imageParticleRef.value);
});
</script>

<style scoped>
.particle-image {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Optional: adjust gap for fewer particles */
@media (max-width: 768px) {
  .particle-image {
    max-width: 100%;
    height: auto !important;
  }
}
</style>

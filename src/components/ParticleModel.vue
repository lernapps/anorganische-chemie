<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { HEIGHT, WIDTH, positions, stateOf } from "./ParticleModel.ts";

defineOptions({ nojs: "caption" });

const props = defineProps<{
  labels: {
    temperature: string;
    solid: string;
    liquid: string;
    gas: string;
    solidText: string;
    liquidText: string;
    gasText: string;
  };
}>();

const temperature = ref(20);
const tick = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still) timer = setInterval(() => (tick.value += 1), 250);
});
onBeforeUnmount(() => {
  if (timer !== undefined) clearInterval(timer);
});

const state = computed(() => stateOf(temperature.value));
const points = computed(() => positions(temperature.value, tick.value));
const name = computed(() => props.labels[state.value]);
const text = computed(() => props.labels[`${state.value}Text` as "solidText" | "liquidText" | "gasText"]);
</script>

<template>
  <div class="particle-model">
    <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img" :aria-label="`${name}: ${text}`" class="particle-model-box">
      <rect x="1" y="1" :width="WIDTH - 2" :height="HEIGHT - 2" fill="none" stroke="currentColor" stroke-width="1" />
      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#1d4ed8" />
    </svg>
    <label class="particle-model-slider">
      <span>{{ labels.temperature }}</span>
      <input v-model.number="temperature" type="range" min="0" max="100" step="1" />
    </label>
    <p class="particle-model-state" aria-live="polite">
      <strong>{{ name }}:</strong> {{ text }}
    </p>
  </div>
</template>

<style scoped>
.particle-model {
  display: grid;
  gap: 0.75rem;
  max-width: 28rem;
}
.particle-model-box {
  width: 100%;
  height: auto;
  background: #f8fafc;
  color: #334155;
}
.particle-model-slider {
  display: grid;
  gap: 0.25rem;
}
.particle-model-slider input {
  width: 100%;
}
</style>

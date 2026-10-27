<script setup lang="ts">
// An atom the learner builds for the element of the task of the number seed: plus and minus for protons, neutrons and
// electrons, drawn as nucleus and shells. Its logic is in AtomBuilder.ts. It is the input of the task: it emits the
// three counts with answer once the learner has changed one (undefined before), and the explainer draws "Prüfen",
// checks them and gives the feedback with the app's message.
import { computed, ref } from "vue";
import { MAXIMUM, describe, generate, shells, type Answer } from "./AtomBuilder.ts";

const props = defineProps<{
  seed: number;
  language: string;
  labels: {
    protons: string;
    neutrons: string;
    electrons: string;
    more: string;
    fewer: string;
  };
}>();

const emit = defineEmits<{ answer: [answer: Answer | undefined] }>();

// the task of the number the explainer gives; "Neue Aufgabe" mounts the component afresh with another

const task = computed(() => generate(props.seed));
const text = computed(() => describe(task.value, props, props.language).task);
const answer = ref<Answer>({ protons: 0, neutrons: 0, electrons: 0 });

type Kind = keyof Answer;
const kinds: Kind[] = ["protons", "neutrons", "electrons"];

function change(kind: Kind, step: number) {
  const next = answer.value[kind] + step;
  if (next < 0 || next > MAXIMUM) return;
  answer.value = { ...answer.value, [kind]: next };
  emit("answer", { ...answer.value });
}

const rings = computed(() => shells(answer.value.electrons));
const radii = [24, 38, 52, 64];

function electronPlaces(ring: number, count: number) {
  const radius = radii[ring] ?? 64;
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
    return { x: 80 + radius * Math.cos(angle), y: 80 + radius * Math.sin(angle) };
  });
}

function nucleusPlaces(total: number, offset: number) {
  return Array.from({ length: total }, (_, index) => {
    const angle = (index + offset) * 2.4;
    const radius = 3 + Math.sqrt(index + offset) * 2.2;
    return { x: 80 + radius * Math.cos(angle), y: 80 + radius * Math.sin(angle) };
  });
}
</script>

<template>
  <div class="atom-builder">
    <p>{{ text }}</p>
    <svg
      viewBox="0 0 160 160"
      role="img"
      :aria-label="`${answer.protons} / ${answer.neutrons} / ${answer.electrons}`"
      class="atom-builder-figure"
    >
      <template v-for="(count, ring) in rings" :key="ring">
        <circle v-if="count > 0" cx="80" cy="80" :r="radii[ring]" fill="none" stroke="#94a3b8" stroke-width="0.6" />
        <circle
          v-for="(place, index) in electronPlaces(ring, count)"
          :key="`e${ring}-${index}`"
          :cx="place.x"
          :cy="place.y"
          r="2.6"
          fill="#1d4ed8"
        />
      </template>
      <circle
        v-for="(place, index) in nucleusPlaces(answer.protons, 0)"
        :key="`p${index}`"
        :cx="place.x"
        :cy="place.y"
        r="3"
        fill="#dc2626"
      />
      <circle
        v-for="(place, index) in nucleusPlaces(answer.neutrons, answer.protons)"
        :key="`n${index}`"
        :cx="place.x"
        :cy="place.y"
        r="3"
        fill="#6b7280"
      />
    </svg>
    <div v-for="kind in kinds" :key="kind" class="atom-builder-row">
      <span class="atom-builder-label"
        >{{ labels[kind] }}: <strong>{{ answer[kind] }}</strong></span
      >
      <button type="button" :aria-label="`${labels[kind]}: ${labels.fewer}`" @click="change(kind, -1)">−</button>
      <button type="button" :aria-label="`${labels[kind]}: ${labels.more}`" @click="change(kind, 1)">+</button>
    </div>
  </div>
</template>

<style>
.atom-builder {
  display: grid;
  gap: 0.75rem;
  max-width: 28rem;
}
.atom-builder-figure {
  width: 100%;
  max-width: 20rem;
  height: auto;
  background: #f8fafc;
}
.atom-builder-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.atom-builder-label {
  flex: 1;
}
.atom-builder-row button {
  min-width: 2.75rem;
  min-height: 2.75rem;
}
</style>

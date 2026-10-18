<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { GROUPS, EDGE_COLOR, TEXT_COLOR, matrix, move, placeOf, type Direction } from "./PeriodicTable.ts";
import { check, describe, generate, reason } from "./ElementFinder.ts";

type Element = {
  symbol: string;
  name: string;
  number: number;
  group: number;
  period: number;
  outer: number;
  kindId: string;
  kind: string;
};

const props = defineProps<{
  seed: number;
  language: string;
  labels: {
    promptName: string;
    promptNumber: string;
    promptPosition: string;
    promptGroup: string;
    promptOuter: string;
    promptKind: string;
    reasonName: string;
    reasonNumber: string;
    reasonPosition: string;
    reasonOuter: string;
    reasonPeriod: string;
    reasonKind: string;
    reasonGroup: string;
    solutionOne: string;
    solutionSome: string;
    solutionAll: string;
    kindMetal: string;
    kindNonmetal: string;
    check: string;
    right: string;
  };
  elements: Element[];
  groups: { group: number; roman: string; name: string }[];
  types: ("name" | "number" | "position" | "group" | "outer" | "kind")[];
}>();

const emit = defineEmits<{ answered: [result: { correct: boolean; reason?: string }] }>();

const task = computed(() => generate(props.seed, props));
const text = computed(() => describe(task.value, props, props.language).task);
const grid = computed(() => matrix(props.elements));
const marked = ref<string[]>([]);
const focusSymbol = ref<string>(props.elements[0]?.symbol ?? "");
const buttons = new Map<string, HTMLButtonElement>();
const romanOf = (group: number) => props.groups.find((info) => info.group === group)?.roman ?? "";

watch(
  () => props.seed,
  () => {
    marked.value = [];
  },
);

function remember(symbol: string, element: unknown) {
  if (element instanceof HTMLButtonElement) buttons.set(symbol, element);
  else buttons.delete(symbol);
}

function tap(symbol: string) {
  focusSymbol.value = symbol;
  if (task.value.multi) {
    marked.value = marked.value.includes(symbol)
      ? marked.value.filter((other) => other !== symbol)
      : [...marked.value, symbol];
  } else {
    marked.value = marked.value[0] === symbol ? [] : [symbol];
  }
}

function keydown(event: KeyboardEvent, element: Element) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const target = move(grid.value, placeOf(element), event.key as Direction);
  const next = grid.value[target.row]?.[target.column];
  if (next) {
    focusSymbol.value = next.symbol;
    buttons.get(next.symbol)?.focus();
  }
}

function verify() {
  const correct = check(task.value, marked.value);
  emit("answered", correct ? { correct } : { correct, reason: reason(task.value, marked.value, props) });
}
</script>

<template>
  <div class="element-finder">
    <p class="ef-task">{{ text }}</p>
    <div class="ef-grid" role="group" :aria-label="text">
      <span class="ef-corner" aria-hidden="true"></span>
      <span v-for="group in GROUPS" :key="group" class="ef-head" aria-hidden="true">{{ romanOf(group) }}</span>
      <template v-for="(line, row) in grid" :key="row">
        <span class="ef-period" aria-hidden="true">{{ row + 1 }}</span>
        <template v-for="(cell, column) in line" :key="column">
          <button
            v-if="cell"
            :ref="(element) => remember(cell.symbol, element)"
            type="button"
            class="ef-cell"
            :class="{ 'ef-cell-marked': marked.includes(cell.symbol) }"
            :style="{ color: TEXT_COLOR, borderColor: EDGE_COLOR }"
            :tabindex="focusSymbol === cell.symbol ? 0 : -1"
            :aria-pressed="marked.includes(cell.symbol)"
            @click="tap(cell.symbol)"
            @keydown="keydown($event, cell)"
          >
            <span class="ef-number">{{ cell.number }}</span>
            <span class="ef-symbol">{{ cell.symbol }}</span>
            <span class="ef-hidden">, {{ cell.name }}</span>
          </button>
          <span v-else class="ef-empty" aria-hidden="true"></span>
        </template>
      </template>
    </div>
    <p class="ef-check">
      <button type="button" class="ef-check-button" @click="verify">{{ labels.check }}</button>
    </p>
  </div>
</template>

<style>
.element-finder {
  display: grid;
  gap: 0.75rem;
  max-width: 44rem;
}
.ef-task {
  margin: 0;
  font-weight: 600;
}
.ef-grid {
  display: grid;
  grid-template-columns: 1.4rem repeat(8, minmax(0, 1fr));
  gap: 2px;
}
.ef-head,
.ef-period {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
}
.ef-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border: 1px solid;
  border-radius: 0.25rem;
  background: #eef0f3;
  font: inherit;
  cursor: pointer;
}
.ef-cell-marked {
  background: #bfdbfe;
  border-width: 3px;
}
.ef-cell:focus-visible,
.ef-check-button:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
.ef-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
.ef-number {
  position: absolute;
  top: 1px;
  left: 2px;
  font-size: 0.5625rem;
  line-height: 1;
}
.ef-symbol {
  font-size: 0.9375rem;
  font-weight: 700;
}
.ef-check {
  margin: 0;
}
.ef-check-button {
  min-height: 2.75rem;
  padding: 0.5rem 1.25rem;
  font: inherit;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  CENTER,
  EDGE_COLOR,
  GROUPS,
  TEXT_COLOR,
  colorOf,
  matrix,
  move,
  placeOf,
  shellPicture,
  shellsOf,
  subscript,
  type Direction,
  type Place,
} from "./PeriodicTable.ts";

type Profile = {
  symbol: string;
  name: string;
  number: number;
  group: number;
  period: number;
  kind: string;
  shells: string;
  compounds: { formula: string; text: string }[];
  uses: string[];
  fact: string;
  note?: string;
};

type GroupInfo = { group: number; roman: string; name: string; text: string };

const props = defineProps<{
  labels: {
    legend: string;
    table: string;
    period: string;
    groupWord: string;
    number: string;
    kind: string;
    shells: string;
    compounds: string;
    uses: string;
    fact: string;
    choose: string;
    showGroup: string;
    hideGroup: string;
  };
  groups: GroupInfo[];
  elements: Profile[];
}>();

const grid = computed(() => matrix(props.elements));
const selected = ref<string | undefined>(undefined);
const active = ref<number | undefined>(undefined);
const focusSymbol = ref<string>(props.elements[0]?.symbol ?? "");
const buttons = new Map<string, HTMLButtonElement>();

const profile = computed(() => props.elements.find((element) => element.symbol === selected.value));
const groupInfo = computed(() => props.groups.find((group) => group.group === active.value));
const picture = computed(() => (profile.value ? shellPicture(shellsOf(profile.value.shells)) : undefined));
const romanOf = (group: number) => props.groups.find((info) => info.group === group)?.roman ?? "";

function remember(symbol: string, element: unknown) {
  if (element instanceof HTMLButtonElement) buttons.set(symbol, element);
  else buttons.delete(symbol);
}

function choose(symbol: string) {
  selected.value = symbol;
  focusSymbol.value = symbol;
}

function toggleGroup(group: number) {
  active.value = active.value === group ? undefined : group;
}

function keydown(event: KeyboardEvent, element: Profile) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const target: Place = move(grid.value, placeOf(element), event.key as Direction);
  const next = grid.value[target.row]?.[target.column];
  if (next) {
    focusSymbol.value = next.symbol;
    buttons.get(next.symbol)?.focus();
  }
}

const label = (element: Profile) =>
  `${element.name}, ${props.labels.number} ${element.number}, ${props.labels.groupWord} ${romanOf(element.group)}`;
</script>

<template>
  <div class="periodic-table">
    <div class="pt-legend" role="group" :aria-label="labels.legend">
      <button
        v-for="info in groups"
        :key="info.group"
        type="button"
        class="pt-legend-item"
        :aria-pressed="active === info.group"
        :style="{ background: colorOf(info.group), color: TEXT_COLOR, borderColor: EDGE_COLOR }"
        @click="toggleGroup(info.group)"
      >
        <strong>{{ info.roman }}</strong> {{ info.name }}
      </button>
    </div>
    <p v-if="groupInfo" class="pt-group" aria-live="polite">
      <strong>{{ groupInfo.roman }} · {{ groupInfo.name }}:</strong> {{ groupInfo.text }}
    </p>
    <div class="pt-grid" role="group" :aria-label="labels.table">
      <span class="pt-corner" aria-hidden="true"></span>
      <span v-for="group in GROUPS" :key="group" class="pt-head" aria-hidden="true">{{ romanOf(group) }}</span>
      <template v-for="(line, row) in grid" :key="row">
        <span class="pt-period" :title="`${labels.period} ${row + 1}`">{{ row + 1 }}</span>
        <template v-for="(cell, column) in line" :key="column">
          <button
            v-if="cell"
            :ref="(element) => remember(cell.symbol, element)"
            type="button"
            class="pt-cell"
            :class="{ 'pt-cell-on': active === cell.group, 'pt-cell-selected': selected === cell.symbol }"
            :style="{ background: colorOf(cell.group), color: TEXT_COLOR, borderColor: EDGE_COLOR }"
            :tabindex="focusSymbol === cell.symbol ? 0 : -1"
            :aria-label="label(cell)"
            :aria-pressed="selected === cell.symbol"
            @click="choose(cell.symbol)"
            @keydown="keydown($event, cell)"
          >
            <span class="pt-number" aria-hidden="true">{{ cell.number }}</span>
            <span class="pt-symbol" aria-hidden="true">{{ cell.symbol }}</span>
          </button>
          <span v-else class="pt-empty" aria-hidden="true"></span>
        </template>
      </template>
    </div>
    <div class="pt-detail" aria-live="polite">
      <p v-if="!profile" class="pt-choose">{{ labels.choose }}</p>
      <div v-else class="pt-card">
        <svg
          viewBox="0 0 120 120"
          class="pt-shells"
          role="img"
          :aria-label="`${profile.name}: ${labels.shells} ${profile.shells}`"
        >
          <circle
            v-for="(radius, index) in picture?.radii"
            :key="index"
            :cx="CENTER"
            :cy="CENTER"
            :r="radius"
            fill="none"
            stroke="#6b7280"
            stroke-width="0.5"
          />
          <circle
            :cx="CENTER"
            :cy="CENTER"
            r="9"
            :fill="colorOf(profile.group)"
            :stroke="EDGE_COLOR"
            stroke-width="0.8"
          />
          <text :x="CENTER" :y="CENTER + 3.5" text-anchor="middle" font-size="10" font-weight="bold" :fill="TEXT_COLOR">
            {{ profile.symbol }}
          </text>
          <circle v-for="(dot, index) in picture?.dots" :key="index" :cx="dot.x" :cy="dot.y" r="1.7" fill="#1d4ed8" />
        </svg>
        <div class="pt-text">
          <p class="pt-name">
            <strong>{{ profile.name }}</strong> ({{ profile.symbol }})
          </p>
          <p class="pt-facts">
            {{ labels.number }} {{ profile.number }} · {{ labels.groupWord }} {{ romanOf(profile.group) }} ·
            {{ labels.period }} {{ profile.period }} · {{ profile.kind }}
          </p>
          <p class="pt-facts">{{ labels.shells }}: {{ profile.shells }}</p>
          <p v-if="profile.compounds.length" class="pt-label">
            <strong>{{ labels.compounds }}</strong>
          </p>
          <ul v-if="profile.compounds.length">
            <li v-for="compound in profile.compounds" :key="compound.formula">
              <strong>{{ subscript(compound.formula) }}</strong
              >: {{ compound.text }}
            </li>
          </ul>
          <p v-if="profile.uses.length" class="pt-label">
            <strong>{{ labels.uses }}</strong>
          </p>
          <ul v-if="profile.uses.length">
            <li v-for="use in profile.uses" :key="use">{{ use }}</li>
          </ul>
          <p v-if="profile.note" class="pt-facts">{{ profile.note }}</p>
          <p class="pt-fact">
            <strong>{{ labels.fact }}</strong> {{ profile.fact }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.periodic-table {
  display: grid;
  gap: 0.75rem;
  max-width: 44rem;
}
.pt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.pt-legend-item {
  border: 1px solid;
  border-radius: 0.5rem;
  padding: 0.375rem 0.625rem;
  min-height: 2.75rem;
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
}
.pt-legend-item[aria-pressed="true"] {
  outline: 3px solid currentColor;
  outline-offset: 1px;
}
.pt-grid {
  display: grid;
  grid-template-columns: 1.1rem repeat(8, minmax(0, 1fr));
  gap: 2px;
}
.pt-head,
.pt-period {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
}
.pt-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border: 1px solid;
  border-radius: 0.25rem;
  font: inherit;
  cursor: pointer;
}
.pt-cell-on {
  outline: 3px solid currentColor;
  outline-offset: -3px;
}
.pt-cell-selected {
  border-width: 3px;
}
.pt-cell:focus-visible,
.pt-legend-item:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
.pt-number {
  position: absolute;
  top: 1px;
  left: 2px;
  font-size: 0.5625rem;
  line-height: 1;
}
.pt-symbol {
  font-size: 0.9375rem;
  font-weight: 700;
}
.pt-card {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
}
@media (min-width: 36rem) {
  .pt-card {
    grid-template-columns: 9rem 1fr;
  }
}
.pt-shells {
  width: 100%;
  max-width: 9rem;
  height: auto;
  background: #f8fafc;
  border-radius: 0.5rem;
}
.pt-text p,
.pt-text ul {
  margin: 0 0 0.375rem;
}
.pt-text ul {
  padding-left: 1.25rem;
}
.pt-facts {
  font-size: 0.875rem;
}
</style>

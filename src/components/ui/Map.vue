<script setup lang="ts">
import { computed, ref } from "vue";
import { VisArea, VisXYContainer } from '@unovis/vue'
import { ChartContainer } from '@/components/ui/chart'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

type MapItem = {
  id: string | number;
  x: number;
  y: number;
  label?: string;
};

const props = withDefaults(
  defineProps<{
    items: MapItem[];
    cellSize?: number;     // world px
    bigCellSize?: number;  // world px
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    showHud?: boolean;
  }>(),
  {
    cellSize: 32,
    bigCellSize: 160,
    minZoom: 0.25,
    maxZoom: 3,
    initialZoom: 1,
    showHud: true,
  }
);

const chartData = [
  { date: new Date("2024-01-01"), desktop: 186, mobile: 80 },
  { date: new Date("2024-02-01"), desktop: 305, mobile: 200 },
  { date: new Date("2024-03-01"), desktop: 237, mobile: 120 },
];

import type { ChartConfig } from '@/components/ui/chart'

type Data = typeof chartData[number]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig


const viewportRef = ref<HTMLDivElement | null>(null);

const pan = ref({ x: 0, y: 0 });   // screen px
const zoom = ref(props.initialZoom);

const dragging = ref(false);
const last = ref({ x: 0, y: 0 });
const cursorStyle = ref("cursor-default");

// Item dragging state
const draggingItem = ref<string | number | null>(null);
const itemDragOffset = ref({ x: 0, y: 0 });
const itemPositions = ref(
  props.items.map(item => ({ ...item }))
);

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const mod = (n: number, m: number) => ((n % m) + m) % m;

// Viewport pan handlers
function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  cursorStyle.value = "cursor-move"
  last.value = { x: e.clientX, y: e.clientY };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  const dx = e.clientX - last.value.x;
  const dy = e.clientY - last.value.y;
  last.value = { x: e.clientX, y: e.clientY };
  pan.value = { x: pan.value.x + dx, y: pan.value.y + dy };
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false;
  cursorStyle.value = "cursor-default";
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } catch { }
}

// Item drag handlers
function onItemPointerDown(e: PointerEvent, item: MapItem) {
  e.stopPropagation(); // Prevent viewport pan
  draggingItem.value = item.id;
  
  // Calculate offset between pointer and item center in world space
  const worldPointerX = (e.clientX - pan.value.x) / zoom.value;
  const worldPointerY = (e.clientY - pan.value.y) / zoom.value;
  
  itemDragOffset.value = {
    x: worldPointerX - item.x,
    y: worldPointerY - item.y
  };
  
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onItemPointerMove(e: PointerEvent) {
  if (draggingItem.value === null) return;
  
  e.stopPropagation();
  
  // Convert screen coordinates to world coordinates
  const worldX = (e.clientX - pan.value.x) / zoom.value;
  const worldY = (e.clientY - pan.value.y) / zoom.value;
  
  // Update item position
  const item = itemPositions.value.find(
    it => it.id === draggingItem.value
  );
  
  if (item) {
    item.x = worldX - itemDragOffset.value.x;
    item.y = worldY - itemDragOffset.value.y;
  }
}

function onItemPointerUp(e: PointerEvent) {
  if (draggingItem.value === null) return;
  
  e.stopPropagation();
  draggingItem.value = null;
  
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } catch { }
}

import { VisAxis } from "@unovis/vue"

const xTickFormat = (v: any) => {
  const d = new Date(v)
  return Number.isNaN(+d) ? String(v) : d.toLocaleDateString()
}

const yTickFormat = (v: any) => {
  const n = Number(v)
  return Number.isFinite(n) ? new Intl.NumberFormat().format(n) : String(v)
}

// Wheel zoom keeping cursor point stable
function onWheel(e: WheelEvent) {
  if (!viewportRef.value) return;
  e.preventDefault();

  const rect = viewportRef.value.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  const oldZoom = zoom.value;
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = clamp(oldZoom * factor, props.minZoom, props.maxZoom);

  const worldX = (cx - pan.value.x) / oldZoom;
  const worldY = (cy - pan.value.y) / oldZoom;

  pan.value = {
    x: cx - worldX * newZoom,
    y: cy - worldY * newZoom,
  };
  zoom.value = newZoom;
}

const worldTransform = computed(
  () => `translate3d(${pan.value.x}px, ${pan.value.y}px, 0) scale(${zoom.value})`
);

// Grid follows pan+zoom via CSS vars
const cssVars = computed(() => {
  const cellZ = props.cellSize * zoom.value;      // screen spacing
  const bigZ = props.bigCellSize * zoom.value;

  return {
    "--cellz": `${cellZ}px`,
    "--bigz": `${bigZ}px`,
    "--offx": `${mod(pan.value.x, cellZ)}px`,
    "--offy": `${mod(pan.value.y, cellZ)}px`,
    "--offxb": `${mod(pan.value.x, bigZ)}px`,
    "--offyb": `${mod(pan.value.y, bigZ)}px`,
  } as Record<string, string>;
});

const hudText = computed(
  () => `x: ${Math.round(pan.value.x)}, y: ${Math.round(pan.value.y)} • ${zoom.value.toFixed(2)}z`
);
</script>

<template>
  <div ref="viewportRef" :class="cursorStyle"
    class="fixed inset-0 overflow-hidden select-none bg-zinc-950 text-zinc-100" :style="cssVars"
    @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp"
    @wheel="onWheel">
    <!-- Grid background (adapts to pan+zoom) -->
    <div class="absolute inset-0 pointer-events-none grid-layer" />

    <!-- World -->
    <div class="absolute inset-0" :style="{ transform: worldTransform, transformOrigin: '0 0' }">
      <div 
        v-for="it in itemPositions" 
        :key="it.id" 
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :class="{ 'cursor-grab': draggingItem !== it.id, 'cursor-grabbing': draggingItem === it.id }"
        :style="{ left: it.x + 'px', top: it.y + 'px' }"
        @pointerdown="(e) => onItemPointerDown(e, it)"
        @pointermove="onItemPointerMove"
        @pointerup="onItemPointerUp"
        @pointercancel="onItemPointerUp"
      >
          <HoverCard>
            <HoverCardTrigger>
              <div class="container-col-flex select-none text-center group">
                <p class="text-xs">{{ it.label }}</p>
                <img class="select-none pointer-events-none" src="/src/assets/icons/video-camera.svg" width="64" height="64" alt="Camera Icon" />
              </div>
            </HoverCardTrigger>

            <HoverCardContent>
              <ChartContainer :config="chartConfig" class="min-h-[200px] w-full">
                <VisXYContainer
                  :data="chartData"
                  :margin="{ top: 8, right: 8, bottom: 28, left: 44 }"
                >
                  <VisArea
                    :x="(d: Data) => d.date"
                    :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
                    :color="[chartConfig.desktop.color, chartConfig.mobile.color]"
                    :rounded-corners="4"
                    bar-padding="0.1"
                    group-padding="0"
                  />

                  <!-- Axes -->
                  <VisAxis
                    type="x"
                    :tickFormat="xTickFormat"
                    tickTextFontSize="10px"
                  />
                  <VisAxis
                    type="y"
                    :tickFormat="yTickFormat"
                    :gridLine="true"
                    tickTextFontSize="10px"
                  />
                </VisXYContainer>
              </ChartContainer>

              <div class="text-sm font-medium">{{ it.label ?? it.id }}</div>
              <div class="text-[11px] opacity-70">x={{ Math.round(it.x) }}, y={{ Math.round(it.y) }}</div>
            </HoverCardContent>
          </HoverCard>
                  
      </div>
    </div>

    <div v-if="showHud"
      class="absolute glassify left-4 bottom-4 container-col-flex z-10 rounded-lg border border-border px-2 py-1 text-xs">
      <p class="opacity-30">{{ hudText }}</p>
    </div>

    <!-- Slot for UI on top -->
    <div class="absolute inset-0 z-20 pointer-events-none">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.grid-layer {
  position: absolute;
  inset: 0;
  background-color: rgb(9 9 11);
}

.grid-layer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px);

  /* scale with zoom */
  background-size: var(--cellz) var(--cellz), var(--cellz) var(--cellz),
    var(--bigz) var(--bigz), var(--bigz) var(--bigz);

  /* shift with pan */
  background-position: var(--offx) var(--offy), var(--offx) var(--offy),
    var(--offxb) var(--offyb), var(--offxb) var(--offyb);
}

.grid-layer::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
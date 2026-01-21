<script setup lang="ts">

import { VisArea, VisXYContainer } from '@unovis/vue'
import { ChartContainer } from '@/components/ui/chart'
import { VisAxis } from "@unovis/vue"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'

const xTickFormat = (v: any) => {
    const d = new Date(v)
    return Number.isNaN(+d) ? String(v) : d.toLocaleDateString()
}

const yTickFormat = (v: any) => {
    const n = Number(v)
    return Number.isFinite(n) ? new Intl.NumberFormat().format(n) : String(v)
}
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

const props = defineProps<{
    id: string | number
    label: string
    mapx: number
    mapy: number
    draggingItem: string | number | null
    onPointerDown: (e: PointerEvent) => void
    onPointerMove: (e: PointerEvent) => void
    onPointerUp: (e: PointerEvent) => void
}>()
</script>

<template>
    <div :style="{ left: props.mapx + 'px', top: props.mapy + 'px' }"
        class="absolute -translate-x-1/2 -translate-y-1/2 container-col-flex select-none text-center group"
        @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp">
        <HoverCard>
            <HoverCardTrigger>
                <div>
                    <p class="text-xs">{{ props.label }}</p>
                    <img class="select-none pointer-events-none" src="/src/assets/icons/video-camera.svg" width="64"
                        height="64" alt="Camera Icon" />
                </div>
            </HoverCardTrigger>

            <HoverCardContent>
                <ChartContainer :config="chartConfig" class="min-h-[200px] w-full">
                    <VisXYContainer :data="chartData" :margin="{ top: 8, right: 8, bottom: 28, left: 44 }">
                        <VisArea :x="(d: Data) => d.date" :y="[(d: Data) => d.desktop, (d: Data) => d.mobile]"
                            :color="[chartConfig.desktop.color, chartConfig.mobile.color]" :rounded-corners="4"
                            bar-padding="0.1" group-padding="0" />

                        <!-- Axes -->
                        <VisAxis type="x" :tickFormat="xTickFormat" tickTextFontSize="10px" />
                        <VisAxis type="y" :tickFormat="yTickFormat" :gridLine="true" tickTextFontSize="10px" />
                    </VisXYContainer>
                </ChartContainer>

            </HoverCardContent>
        </HoverCard>
    </div>
</template>
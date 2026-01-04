<script setup lang="tsx">
import Map from '@/components/ui/Map.vue';

const items = [
  { id: 1, x: 120, y: 80, label: "Server A" },
  { id: 2, x: 420, y: 260, label: "DB" },
  { id: 3, x: 900, y: 140, label: "Proxy" },
];

</script>

<template>
    <Map :items="items"/>
</template>
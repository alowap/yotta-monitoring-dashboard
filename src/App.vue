<script setup lang="ts">

import { useColorMode } from '@vueuse/core';

const mode = useColorMode()
mode.value = 'dark'

</script>

<template>
  <RouterView />
</template>
<!-- app/components/AppLogo.vue -->
<template>
  <div
      class="app-logo text-high-emphasis"
      :style="{ height: `${height}px` }"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ height?: number }>(), {
  height: 48
})
</script>

<style scoped>
.app-logo {
  width: 100%;
  display: block;
  background-color: currentColor;

  /* Richtet das Logo linksbündig aus und skaliert es proportional */
  mask: url('/chargebook.svg') no-repeat center / contain;
  -webkit-mask: url('/chargebook.svg') no-repeat center / contain;
}
</style>
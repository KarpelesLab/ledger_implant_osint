<script setup lang="ts">
// An implant's printed marking, drawn the way it appears on the board: white silkscreen on solder mask.
defineProps<{ text: string; size?: 'small' | 'large' }>()
</script>

<template>
  <code class="silk" :class="size ?? 'small'" :title="`Printed on the implant: ${text}`">{{
    text
  }}</code>
</template>

<style scoped>
.silk {
  display: inline-block;
  max-width: 100%;
  font-family: var(--font-mono);
  color: var(--silk);
  background: var(--mask);
  border-radius: 2px;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
  box-shadow: inset 0 0 0 1px var(--mask-edge);
}
.small {
  font-size: 0.8rem;
  padding: 0.2em 0.55em;
}
.large {
  font-size: clamp(1rem, 2.6vw, 1.35rem);
  padding: 0.45em 0.8em;
}
</style>

<script setup lang="ts">
import type { ImplantStatus } from '@/reports'

defineProps<{ status: ImplantStatus; version?: string }>()
</script>

<template>
  <span class="badge" :class="status">
    {{ status }}<template v-if="version"> · v{{ version }}</template>
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
  border: 1px solid currentColor;
}
.confirmed {
  color: var(--danger);
}
.suspected {
  color: var(--warn);
}
.unverified {
  color: var(--muted);
}
.clean {
  color: var(--ok);
}
</style>

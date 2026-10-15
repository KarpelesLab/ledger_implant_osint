<script setup lang="ts">
import { statusLabel, type ImplantStatus } from '@/reports'

defineProps<{ status: ImplantStatus }>()
</script>

<template>
  <span class="status" :class="status">{{ statusLabel[status] }}</span>
</template>

<style scoped>
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  font-weight: 600;
  white-space: nowrap;
}
.status::before {
  content: '';
  width: 0.6em;
  height: 0.6em;
  border-radius: 1px;
  background: currentColor;
}
.confirmed {
  color: var(--confirmed);
}
.suspected {
  color: var(--suspected);
}
.counterfeit {
  color: var(--confirmed);
}
.unverified,
.pending {
  color: var(--muted);
}
.clean {
  color: var(--clean);
}
</style>

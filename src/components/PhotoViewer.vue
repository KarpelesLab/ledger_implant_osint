<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Report } from '@/reports'

const props = defineProps<{ images: Report['images'] }>()
const index = defineModel<number | null>({ required: true })

const dialog = ref<HTMLDialogElement>()
const current = computed(() => (index.value === null ? undefined : props.images[index.value]))

watch(index, (i) => {
  if (i === null) dialog.value?.close()
  else if (!dialog.value?.open) dialog.value?.showModal()
})

function step(delta: number) {
  if (index.value === null) return
  const n = props.images.length
  index.value = (index.value + delta + n) % n
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

// Clicking the backdrop (the dialog element itself, outside the content) closes it.
function onClick(e: MouseEvent) {
  if (e.target === dialog.value) index.value = null
}
</script>

<template>
  <dialog
    ref="dialog"
    class="viewer"
    aria-label="Photo viewer"
    @close="index = null"
    @keydown="onKey"
    @click="onClick"
  >
    <figure v-if="current">
      <img :src="current.url" :alt="current.caption ?? current.file" />
      <figcaption>
        <span class="count">{{ (index ?? 0) + 1 }} of {{ images.length }}</span>
        {{ current.caption }}
        <a :href="current.url" target="_blank" rel="noopener">Open full size</a>
      </figcaption>
    </figure>
    <div class="controls">
      <button v-if="images.length > 1" type="button" @click="step(-1)">Previous</button>
      <button v-if="images.length > 1" type="button" @click="step(1)">Next</button>
      <button type="button" class="close" @click="index = null">Close</button>
    </div>
  </dialog>
</template>

<style scoped>
.viewer {
  width: min(1200px, 100vw - 32px);
  max-height: calc(100vh - 32px);
  padding: 0;
  border: none;
  border-radius: 4px;
  background: var(--surface);
  color: var(--ink);
  overflow: auto;
}
.viewer::backdrop {
  background: rgb(8 14 12 / 0.85);
}
@media (prefers-reduced-motion: no-preference) {
  .viewer[open] {
    animation: appear 160ms ease-out;
  }
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
  }
}
figure {
  margin: 0;
}
img {
  display: block;
  width: 100%;
  max-height: calc(100vh - 180px);
  object-fit: contain;
  background: var(--mask);
}
figcaption {
  padding: 0.9rem 1.25rem 0;
  color: var(--ink);
  max-width: 70ch;
}
.count {
  color: var(--muted);
  margin-right: 0.5em;
}
figcaption a {
  margin-left: 0.4em;
  white-space: nowrap;
}
.controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.9rem 1.25rem 1.1rem;
}
.close {
  margin-left: auto;
}
button {
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.45em 0.95em;
  border-radius: 3px;
  border: 1px solid var(--rule);
  background: var(--bg);
  color: var(--ink);
  cursor: pointer;
}
button:hover {
  border-color: var(--ink);
}
</style>

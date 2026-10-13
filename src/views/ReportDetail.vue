<script setup lang="ts">
import { computed } from 'vue'
import { findReport, formatDate } from '@/reports'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps<{ id: string }>()
const report = computed(() => findReport(props.id))

const purchaseRows = computed(() => {
  const p = report.value?.purchase
  if (!p) return []
  return [
    ['Retailer', p.retailer],
    ['Store', p.store],
    ['Location', [p.city, p.country].filter(Boolean).join(', ')],
    ['Purchased', p.date ?? p.dateNote],
    ['Price', p.price],
  ].filter((row): row is [string, string] => !!row[1])
})
</script>

<template>
  <RouterLink to="/" class="back">← All reports</RouterLink>

  <p v-if="!report">Report not found.</p>

  <article v-else>
    <header>
      <StatusBadge :status="report.implant.status" :version="report.implant.version" />
      <h1>{{ report.title }}</h1>
      <p class="meta">Reported {{ formatDate(report.reportedAt) }}</p>
    </header>

    <div class="facts">
      <section>
        <h2>Device</h2>
        <dl>
          <dt>Model</dt>
          <dd>{{ report.device.model }}</dd>
          <template v-if="report.device.variant">
            <dt>Variant</dt>
            <dd>{{ report.device.variant }}</dd>
          </template>
          <template v-if="report.device.ean">
            <dt>EAN</dt>
            <dd>
              <code>{{ report.device.ean }}</code>
            </dd>
          </template>
        </dl>
      </section>

      <section>
        <h2>Purchase</h2>
        <p v-if="!purchaseRows.length" class="meta">Unknown</p>
        <dl v-else>
          <template v-for="[k, v] in purchaseRows" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </template>
        </dl>
      </section>

      <section>
        <h2>Implant</h2>
        <dl>
          <dt>Status</dt>
          <dd>{{ report.implant.status }}</dd>
          <template v-if="report.implant.version">
            <dt>Version</dt>
            <dd>v{{ report.implant.version }}</dd>
          </template>
          <template v-if="report.implant.marking">
            <dt>Marking</dt>
            <dd>
              <code>{{ report.implant.marking }}</code>
            </dd>
          </template>
          <template v-if="report.implant.analyzedBy">
            <dt>Analyzed by</dt>
            <dd>{{ report.implant.analyzedBy }}</dd>
          </template>
          <template v-if="report.implant.components?.length">
            <dt>Components</dt>
            <dd>
              <ul class="components">
                <li v-for="c in report.implant.components" :key="c">{{ c }}</li>
              </ul>
            </dd>
          </template>
        </dl>
        <p v-if="report.implant.notes">{{ report.implant.notes }}</p>
      </section>
    </div>

    <section>
      <h2>Sources</h2>
      <ul class="sources">
        <li v-for="s in report.sources" :key="s.url">
          <a :href="s.url" target="_blank" rel="noopener noreferrer">
            <template v-if="s.title">{{ s.title }} — </template>
            <template v-if="s.author">{{ s.author }}</template>
            <template v-if="s.handle"> (@{{ s.handle }})</template>
            <template v-if="!s.author && !s.handle">{{ s.url }}</template>
          </a>
          <span v-if="s.postedAt" class="meta"> · {{ formatDate(s.postedAt) }}</span>
          <blockquote v-if="s.text">{{ s.text }}</blockquote>
        </li>
      </ul>
    </section>

    <section>
      <h2>Pictures</h2>
      <div class="gallery">
        <figure v-for="img in report.images" :key="img.file">
          <a :href="img.url" target="_blank" rel="noopener">
            <img :src="img.url" :alt="img.caption ?? img.file" loading="lazy" />
          </a>
          <figcaption>
            {{ img.caption }}
            <a v-if="img.source" :href="img.source" target="_blank" rel="noopener noreferrer"
              >source</a
            >
          </figcaption>
        </figure>
      </div>
    </section>
  </article>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 1rem;
}
h1 {
  margin: 0.5rem 0 0.25rem;
}
h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  margin: 1.5rem 0 0.5rem;
}
.meta {
  color: var(--muted);
  margin: 0;
}
.facts {
  display: grid;
  gap: 0 2rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 1rem;
  margin: 0;
}
dt {
  color: var(--muted);
}
dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.components {
  margin: 0;
  padding-left: 1.1rem;
}
.sources {
  padding-left: 1.2rem;
}
blockquote {
  white-space: pre-line;
  margin: 0.4rem 0 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--border);
  color: var(--muted);
}
.gallery {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
figure {
  margin: 0;
}
figure img {
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  background: var(--surface);
}
figcaption {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 0.4rem;
}
</style>

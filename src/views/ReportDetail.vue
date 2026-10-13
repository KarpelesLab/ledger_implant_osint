<script setup lang="ts">
import { computed, ref } from 'vue'
import { findReport, formatDate, place, summary } from '@/reports'
import StatusBadge from '@/components/StatusBadge.vue'
import SilkMarking from '@/components/SilkMarking.vue'
import PhotoViewer from '@/components/PhotoViewer.vue'

const props = defineProps<{ id: string }>()
const report = computed(() => findReport(props.id))
const viewing = ref<number | null>(null)

const purchaseRows = computed(() => {
  const p = report.value?.purchase
  if (!p) return []
  return [
    ['Seller', p.retailer],
    ['Store', p.store],
    ['Place', place(p)],
    ['When', p.date ? formatDate(p.date) : p.dateNote],
    ['Note', p.date ? p.dateNote : undefined],
    ['Shipped from', p.shippedFrom],
    ['Price', p.price],
  ].filter((row): row is [string, string] => !!row[1])
})
</script>

<template>
  <RouterLink to="/" class="back">All reports</RouterLink>

  <div v-if="!report" class="missing">
    <h1>No report with this address</h1>
    <p>It may have been renamed. <RouterLink to="/">See all reports</RouterLink>.</p>
  </div>

  <article v-else>
    <header class="head">
      <h1>{{ report.title }}</h1>
      <p class="lede">{{ summary(report) }}</p>
      <div class="verdict">
        <StatusBadge :status="report.implant.status" />
        <SilkMarking v-if="report.implant.marking" :text="report.implant.marking" size="large" />
      </div>
    </header>

    <div class="layout">
      <dl class="facts">
        <div class="group">
          <h2>Device</h2>
          <dt>Model</dt>
          <dd>{{ report.device.model }}</dd>
          <template v-if="report.device.variant">
            <dt>Variant</dt>
            <dd>{{ report.device.variant }}</dd>
          </template>
          <template v-if="report.device.ean">
            <dt>EAN</dt>
            <dd>{{ report.device.ean }}</dd>
          </template>
        </div>

        <div class="group">
          <h2>Purchase</h2>
          <template v-if="purchaseRows.length">
            <template v-for="[k, v] in purchaseRows" :key="k">
              <dt>{{ k }}</dt>
              <dd>{{ v }}</dd>
            </template>
          </template>
          <p v-else class="muted">Not given in the sources.</p>
        </div>

        <div class="group">
          <h2>Implant</h2>
          <template v-if="report.implant.version">
            <dt>Version</dt>
            <dd>v{{ report.implant.version }}</dd>
          </template>
          <template v-if="report.implant.generation">
            <dt>Generation</dt>
            <dd>{{ report.implant.generation }}</dd>
          </template>
          <template v-if="report.implant.analyzedBy">
            <dt>Examined by</dt>
            <dd>{{ report.implant.analyzedBy }}</dd>
          </template>
          <dt>Reported</dt>
          <dd>{{ formatDate(report.reportedAt) }}</dd>
        </div>
      </dl>

      <div class="prose">
        <template v-if="report.implant.notes">
          <h2>What was found</h2>
          <p>{{ report.implant.notes }}</p>
        </template>
        <template v-if="report.implant.components?.length">
          <h2>Parts identified</h2>
          <ul>
            <li v-for="c in report.implant.components" :key="c">{{ c }}</li>
          </ul>
        </template>
      </div>
    </div>

    <section v-if="report.videos.length" class="photos" aria-labelledby="videos-title">
      <h2 id="videos-title">{{ report.videos.length > 1 ? 'Videos' : 'Video' }}</h2>
      <ul class="grid">
        <li v-for="v in report.videos" :key="v.file">
          <figure>
            <video
              :src="v.url"
              :poster="v.posterUrl"
              controls
              preload="none"
              playsinline
              class="clip"
            ></video>
            <figcaption>
              {{ v.caption }}
              <a v-if="v.source" :href="v.source" target="_blank" rel="noopener noreferrer"
                >Source</a
              >
            </figcaption>
          </figure>
        </li>
      </ul>
    </section>

    <section class="photos" aria-labelledby="photos-title">
      <h2 id="photos-title">Photos</h2>
      <p class="muted">Select a photo to view it full size.</p>
      <ul class="grid">
        <li v-for="(img, i) in report.images" :key="img.file">
          <figure>
            <button type="button" class="open" @click="viewing = i">
              <img :src="img.url" :alt="img.caption ?? img.file" loading="lazy" />
            </button>
            <figcaption>
              {{ img.caption }}
              <a v-if="img.source" :href="img.source" target="_blank" rel="noopener noreferrer"
                >Source</a
              >
            </figcaption>
          </figure>
        </li>
      </ul>
    </section>

    <section class="sources" aria-labelledby="sources-title">
      <h2 id="sources-title">Sources</h2>
      <ol>
        <li v-for="s in report.sources" :key="s.url">
          <p class="who">
            <a :href="s.url" target="_blank" rel="noopener noreferrer">{{
              s.title ?? s.author ?? s.url
            }}</a>
            <span class="muted">
              <template v-if="s.title && s.author"> by {{ s.author }}</template>
              <template v-else-if="s.handle"> @{{ s.handle }}</template>
              <template v-if="s.postedAt">, {{ formatDate(s.postedAt) }}</template>
            </span>
          </p>
          <blockquote v-if="s.text">{{ s.text }}</blockquote>
        </li>
      </ol>
    </section>

    <PhotoViewer v-model="viewing" :images="report.images" />
  </article>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-top: 1.5rem;
  font-weight: 600;
}
.back::before {
  content: '‹';
  margin-right: 0.35em;
}
.missing {
  padding: 3rem 0;
}

.head {
  max-width: 48rem;
  padding: 1.5rem 0 2.25rem;
}
h1 {
  font-size: clamp(1.8rem, 4.4vw, 2.6rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.015em;
  margin: 0 0 0.9rem;
  text-wrap: balance;
}
.lede {
  font-size: 1.2rem;
  line-height: 1.55;
  margin: 0 0 1.25rem;
}
.verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  font-size: 1.05rem;
}

h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.6rem;
}
.muted {
  color: var(--muted);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 23rem) minmax(0, 1fr);
  gap: 2rem 3.5rem;
  padding-top: 2rem;
  border-top: 2px solid var(--ink);
}
@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.facts {
  margin: 0;
}
.group {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.3rem 1rem;
  margin-bottom: 1.75rem;
}
.group h2,
.group p {
  grid-column: 1 / -1;
  margin-bottom: 0.2rem;
}
.group p {
  margin-top: 0;
}
dt {
  color: var(--muted);
}
dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.prose {
  max-width: 38rem;
}
.prose p {
  margin: 0 0 1.75rem;
}
.prose ul {
  margin: 0 0 1.75rem;
  padding-left: 1.2rem;
}
.prose li {
  margin-bottom: 0.35rem;
}
.prose li::marker {
  color: var(--accent);
}

.photos,
.sources {
  padding-top: 2rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--rule);
}
.photos .muted {
  margin: -0.3rem 0 1.25rem;
  font-size: 0.92rem;
}
/* Photos keep their own shape, uncropped, and read left to right in source order. */
.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
  gap: 1.75rem 1.25rem;
  align-items: start;
}
figure {
  margin: 0;
}
.open {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: var(--mask);
  border-radius: 2px;
  cursor: zoom-in;
}
.open img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 2px;
}
.clip {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 2px;
  background: var(--mask);
}
.open:hover img {
  opacity: 0.92;
}
figcaption {
  margin-top: 0.55rem;
  font-size: 0.92rem;
  line-height: 1.5;
}
figcaption a {
  margin-left: 0.25em;
}

.sources ol {
  padding: 0;
  margin: 0;
  list-style: none;
  max-width: 44rem;
}
.sources li {
  margin-bottom: 1.5rem;
}
.who {
  margin: 0 0 0.4rem;
}
.who a {
  font-weight: 600;
}
blockquote {
  margin: 0;
  padding: 0.1rem 0 0.1rem 1rem;
  border-left: 3px solid var(--rule);
  white-space: pre-line;
  color: var(--muted);
}
</style>

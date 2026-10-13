<script setup lang="ts">
import { reports, formatDate } from '@/reports'
import StatusBadge from '@/components/StatusBadge.vue'
</script>

<template>
  <p class="intro">
    Publicly reported Ledger devices found with hardware implants, collected from posts and photos
    by different people. Each entry links to its original sources.
  </p>

  <ul class="list">
    <li v-for="r in reports" :key="r.id">
      <RouterLink :to="{ name: 'report', params: { id: r.id } }" class="card">
        <img
          v-if="r.images[0]"
          :src="r.images[0].url"
          :alt="r.images[0].caption ?? r.title"
          loading="lazy"
        />
        <div class="body">
          <StatusBadge :status="r.implant.status" :version="r.implant.version" />
          <h2>{{ r.title }}</h2>
          <p class="meta">
            {{ r.device.model }}
            <template v-if="r.purchase.retailer"> · {{ r.purchase.retailer }}</template>
            <template v-if="r.purchase.city"> · {{ r.purchase.city }}</template>
            · reported {{ formatDate(r.reportedAt) }}
          </p>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.intro {
  color: var(--muted);
  max-width: 60ch;
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
.card {
  display: block;
  color: inherit;
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.card:hover {
  border-color: var(--accent);
}
.card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.body {
  padding: 0.75rem 1rem 1rem;
}
h2 {
  font-size: 1.05rem;
  margin: 0.5rem 0 0.25rem;
}
.meta {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { reports, formatDate, place } from '@/reports'
import StatusBadge from '@/components/StatusBadge.vue'
import SilkMarking from '@/components/SilkMarking.vue'
import { newCaseUrl } from '@/links'

const sellerCount = computed(
  () => new Set(reports.map((r) => r.purchase.retailer).filter(Boolean)).size,
)
</script>

<template>
  <section class="intro">
    <h1>Tampered Ledger wallets, and where they were bought</h1>
    <p class="lede">
      Each report here is a Ledger device found with an extra circuit inside, added after it left
      the factory. The circuits found so far carry their own antenna. On the units examined in
      detail, they read the recovery phrase off the screen.
    </p>
    <p class="count">
      {{ reports.length }} devices from {{ sellerCount }} named sellers so far. Every report links
      to the people who found it.
    </p>
    <p class="cta">
      Seen a tampered device that isn't listed?
      <a :href="newCaseUrl" target="_blank" rel="noopener">Report new case</a>. A link to the post
      is enough.
    </p>
  </section>

  <aside class="advice" aria-labelledby="advice-title">
    <h2 id="advice-title">Bought a device from one of these sellers?</h2>
    <p>
      Don't set it up. If you already have, treat its recovery phrase as exposed. Create a new
      phrase on a device bought directly from Ledger and move your funds to it.
    </p>
  </aside>

  <table class="register">
    <caption>
      All reports, newest first
    </caption>
    <thead>
      <tr>
        <th scope="col"><span class="visually-hidden">Photo</span></th>
        <th scope="col">Device</th>
        <th scope="col">Bought from</th>
        <th scope="col">Implant</th>
        <th scope="col">Reported</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in reports" :key="r.id">
        <td class="thumb">
          <img v-if="r.images[0]" :src="r.images[0].url" alt="" loading="lazy" />
        </td>
        <td class="device">
          <RouterLink :to="{ name: 'report', params: { id: r.id } }" class="row-link">{{
            r.device.model
          }}</RouterLink>
          <span v-if="r.device.variant" class="sub">{{ r.device.variant }}</span>
        </td>
        <td data-label="Bought from">
          <template v-if="r.purchase.retailer">
            <span class="seller">{{ r.purchase.retailer }}</span>
            <span v-if="r.purchase.store" class="sub">{{ r.purchase.store }}</span>
            <span class="sub">{{ place(r.purchase) }}</span>
          </template>
          <span v-else class="sub">Not given</span>
        </td>
        <td data-label="Implant">
          <StatusBadge :status="r.implant.status" />
          <span class="mark">
            <SilkMarking v-if="r.implant.marking" :text="r.implant.marking" />
            <span v-else-if="r.implant.generation" class="sub">{{ r.implant.generation }}</span>
          </span>
        </td>
        <td data-label="Reported" class="date">{{ formatDate(r.reportedAt) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.intro {
  max-width: 44rem;
  padding: clamp(1.5rem, 5vw, 3.5rem) 0 1.5rem;
}
h1 {
  font-size: clamp(2rem, 5.2vw, 3.1rem);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 1.25rem;
  text-wrap: balance;
}
.lede {
  font-size: 1.2rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}
.count {
  color: var(--muted);
  margin: 0;
}
.cta {
  margin: 0.75rem 0 0;
}
.cta a {
  font-weight: 700;
}

.advice {
  max-width: 44rem;
  margin: 1rem 0 3rem;
  padding: 1.1rem 1.35rem 1.2rem;
  background: var(--surface);
  border-left: 4px solid var(--accent-strong);
  border-radius: 0 3px 3px 0;
}
.advice h2 {
  font-size: 1.05rem;
  margin: 0 0 0.35rem;
}
.advice p {
  margin: 0;
}

.register {
  width: 100%;
  border-collapse: collapse;
}
caption {
  text-align: left;
  font-weight: 700;
  font-size: 1.25rem;
  padding-bottom: 0.75rem;
}
th {
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  padding: 0 1rem 0.5rem 0;
  border-bottom: 2px solid var(--ink);
}
td {
  padding: 1rem 1rem 1rem 0;
  border-bottom: 1px solid var(--rule);
  vertical-align: top;
}
tbody tr {
  position: relative;
}
tbody tr:hover {
  background: var(--surface);
}
.thumb {
  width: 88px;
  padding-left: 0.5rem;
}
.thumb img {
  display: block;
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 2px;
  background: var(--mask);
}
.device {
  font-weight: 700;
  font-size: 1.1rem;
}
/* The device link covers the whole row, so any part of it opens the report. */
.row-link {
  color: var(--ink);
  text-decoration: none;
}
.row-link::after {
  content: '';
  position: absolute;
  inset: 0;
}
.row-link:focus-visible {
  outline: none;
}
.row-link:focus-visible::after {
  outline: 3px solid var(--accent-strong);
  outline-offset: -3px;
}
tbody tr:hover .row-link {
  text-decoration: underline;
}
.seller {
  font-weight: 600;
}
.sub {
  display: block;
  color: var(--muted);
  font-size: 0.92rem;
  font-weight: 400;
}
.mark {
  display: block;
  margin-top: 0.35rem;
}
.date {
  white-space: nowrap;
  color: var(--muted);
}

@media (max-width: 720px) {
  thead {
    display: none;
  }
  .register,
  tbody,
  tr,
  td {
    display: block;
  }
  tr {
    display: grid;
    grid-template-columns: 72px 1fr;
    column-gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--rule);
  }
  td {
    grid-column: 2;
    padding: 0 0 0.6rem;
    border: none;
  }
  .thumb {
    grid-column: 1;
    grid-row: 1 / span 4;
    width: auto;
    padding: 0;
  }
  caption {
    display: block;
  }
  td[data-label]::before {
    content: attr(data-label);
    display: block;
    font-size: 0.8rem;
    color: var(--muted);
  }
}
</style>

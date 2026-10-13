<script setup lang="ts">
import { repoUrl as repo, newCaseUrl } from '@/links'
</script>

<template>
  <a href="#main" class="skip">Skip to content</a>
  <header class="site">
    <RouterLink to="/" class="brand">Ledger Implant OSINT</RouterLink>
    <nav aria-label="Project">
      <a :href="newCaseUrl" target="_blank" rel="noopener" class="report-link">Report new case</a>
      <a :href="repo" target="_blank" rel="noopener">GitHub</a>
    </nav>
  </header>
  <main id="main">
    <RouterView />
  </main>
  <footer class="site-foot">
    <p>
      Reports and photos are kept in the
      <a :href="repo" target="_blank" rel="noopener">GitHub repository</a>. Each photo belongs to
      the person credited in its source.
    </p>
  </footer>
</template>

<style>
:root {
  color-scheme: light;
  --font-sans: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
  --font-mono: 'Atkinson Hyperlegible Mono', ui-monospace, monospace;

  /* Bench grey, green-black ink, and Kapton amber: the colour of the implant flex. */
  --bg: #f2f4f3;
  --surface: #ffffff;
  --ink: #17211d;
  --muted: #56625c;
  --rule: #d2d9d5;
  --accent: #9a5800;
  --accent-strong: #c27400;
  --mask: #18231f;
  --mask-edge: #2c3a34;
  --silk: #f1f4f2;
  --confirmed: #a3221b;
  --suspected: #8a5a00;
  --clean: #1d6b3a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
    --bg: #0f1a16;
    --surface: #15241e;
    --ink: #e3eae6;
    --muted: #9caba3;
    --rule: #2a3c35;
    --accent: #eda13a;
    --accent-strong: #eda13a;
    --mask: #08100d;
    --mask-edge: #2f443b;
    --silk: #eef3f0;
    --confirmed: #ff8b80;
    --suspected: #f2c060;
    --clean: #7fd3a0;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1.125rem;
  line-height: 1.6;
  font-kerning: normal;
}
a {
  color: var(--accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}
a:hover {
  text-decoration-thickness: 2px;
}
:focus-visible {
  outline: 3px solid var(--accent-strong);
  outline-offset: 2px;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.skip {
  position: absolute;
  left: 16px;
  top: -3rem;
  background: var(--surface);
  padding: 0.4rem 0.8rem;
  z-index: 10;
}
.skip:focus {
  top: 0.5rem;
}

.site,
main,
.site-foot {
  max-width: 72rem;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}
@media (min-width: 720px) {
  .site,
  main,
  .site-foot {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
.site {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem 1.5rem;
  padding-top: 1.1rem;
  padding-bottom: 1.1rem;
}
.brand {
  font-weight: 800;
  color: var(--ink);
  text-decoration: none;
}
.site nav {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  font-size: 0.95rem;
}
.report-link {
  font-weight: 700;
}
main {
  padding-bottom: 4rem;
}
.site-foot {
  padding-top: 1.5rem;
  padding-bottom: 2.5rem;
  color: var(--muted);
  font-size: 0.92rem;
}
.site-foot p {
  max-width: 44rem;
  margin: 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--rule);
}
</style>

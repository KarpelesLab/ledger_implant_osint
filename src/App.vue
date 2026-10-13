<script setup lang="ts"></script>

<template>
  <header class="site">
    <RouterLink to="/" class="brand">Ledger Implant OSINT</RouterLink>
    <a href="https://github.com/KarpelesLab/ledger_implant_osint" target="_blank" rel="noopener"
      >GitHub</a
    >
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style>
:root {
  color-scheme: light dark;
  --bg: #fafafa;
  --surface: #ffffff;
  --text: #1a1a1a;
  --muted: #5f6368;
  --border: #dadce0;
  --accent: #1a73e8;
  --danger: #c5221f;
  --warn: #b06000;
  --ok: #188038;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --surface: #1e1e1e;
    --text: #e8eaed;
    --muted: #9aa0a6;
    --border: #3c4043;
    --accent: #8ab4f8;
    --danger: #f28b82;
    --warn: #fdd663;
    --ok: #81c995;
  }
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
  line-height: 1.5;
}
a {
  color: var(--accent);
}
code {
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 0.9em;
}
.site {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.brand {
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}
main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 16px 3rem;
}
</style>

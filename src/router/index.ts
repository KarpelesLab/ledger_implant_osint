import { createRouter, createWebHistory } from 'vue-router'
import ReportList from '@/views/ReportList.vue'
import ReportDetail from '@/views/ReportDetail.vue'
import { findReport } from '@/reports'
import { homeTitle, reportDescription, reportTitle, siteDescription } from '@/seo'

// Links from before the switch to real paths look like #/report/<id>. Move them over before the
// router reads the current address.
if (location.hash.startsWith('#/')) {
  history.replaceState(null, '', import.meta.env.BASE_URL + location.hash.slice(2))
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'list', component: ReportList },
    // The trailing slash matches the folder each report page is built into.
    { path: '/report/:id/', name: 'report', component: ReportDetail, props: true },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

// Keep the tab title and description in step with the page, as the build does for each URL.
router.afterEach((to) => {
  const report = to.name === 'report' ? findReport(String(to.params.id)) : undefined
  document.title = report ? reportTitle(report) : homeTitle()
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', report ? reportDescription(report) : siteDescription)
})

export default router

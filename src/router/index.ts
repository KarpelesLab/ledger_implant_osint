import { createRouter, createWebHashHistory } from 'vue-router'
import ReportList from '@/views/ReportList.vue'
import ReportDetail from '@/views/ReportDetail.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'list', component: ReportList },
    { path: '/report/:id', name: 'report', component: ReportDetail, props: true },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

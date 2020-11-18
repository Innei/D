import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import QProgress from 'qier-progress'

const qprogress = new QProgress()

const routes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    component: () => import('./App'),
    children: [
      {
        path: '/',
        component: defineAsyncComponent(() =>
          import('./views/home').then((mo) => mo.HomeView),
        ),
        name: 'home',
      },

      {
        path: '/notes/:id',
        props: true,
        component: defineAsyncComponent(() =>
          import('@/views/content').then((mo) => mo.NoteContentView),
        ),
        name: 'note',
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((before, to, next) => {
  qprogress.start()
  next()
})
router.afterEach(() => {
  qprogress.finish()
})
router.onError(() => {
  qprogress.finish()
})
export default router

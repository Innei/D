import QProgress from 'qier-progress'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { configs } from '../configs'
import { NoteContentView } from './views/content'
import { HomeView } from './views/home'
import { AboutView } from './views/page/about'

const qprogress = new QProgress()

const routes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    component: () => import('./App'),
    children: [
      {
        path: '/',
        component: HomeView,
        meta: {
          title: configs.title + ' | ' + configs.subtitle,
          fulltitle: true,
        },
        name: 'home',
      },

      {
        path: '/notes/:id',
        props: true,
        component: NoteContentView,
        meta: { title: '' },
        name: 'note',
      },
      {
        path: '/about',
        component: AboutView,
        meta: { title: '关于' },
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
  if (to.meta.title) {
    document.title = to.meta.fulltitle
      ? to.meta.title
      : to.meta.title + ' | ' + configs.title
  }
  next()
})
router.afterEach(() => {
  qprogress.finish()
})
router.onError(() => {
  qprogress.finish()
})
export default router

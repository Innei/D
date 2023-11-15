import QProgress from 'qier-progress'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { configs } from './configs'
import { useSyncStore } from './store'
import { HomeView } from './views/home'
import { NoteContentView } from './views/note-detail'
import { PostContentView } from './views/post-detail'

const qprogress = new QProgress()

const routes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    component: () => import('./App').then((m) => m.App),
    children: [
      {
        path: '/',
        component: HomeView,
        meta: {
          title: `${configs.title} | ${configs.subtitle}`,
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
        path: '/posts/:category/:slug',
        props: true,
        component: PostContentView,
        meta: { title: '' },
        name: 'post',
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((before, to, next) => {
  if (!useSyncStore().isReady) {
    qprogress.start()
  }
  if (to.meta.title) {
    document.title =
      ((to.meta.fulltitle
        ? to.meta.title
        : `${to.meta.title} | ${configs.title}`) as any) ?? ''
  }
  next()
})
router.afterEach(() => {
  qprogress.finish()
})
router.onError(() => {
  qprogress.finish()
})

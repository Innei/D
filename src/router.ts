/*
 * @Author: Innei
 * @Date: 2020-11-18 21:58:15
 * @LastEditTime: 2021-03-14 14:30:14
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/router.ts
 * Mark: Coding with Love
 */
import QProgress from 'qier-progress'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { configs } from './configs'
import { NoteContentView } from './views/content'
import { HomeView } from './views/home'
import { AboutView } from './views/page/about'

const qprogress = new QProgress()

const routes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    component: () => import('./App.vue'),
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
  history: createWebHistory(),
  routes,
})

router.beforeEach((before, to, next) => {
  qprogress.start()
  if (to.meta.title) {
    document.title =
      ((to.meta.fulltitle
        ? to.meta.title
        : to.meta.title + ' | ' + configs.title) as any) ?? ''
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

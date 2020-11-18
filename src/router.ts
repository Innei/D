import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((before, to, next) => {
  // todo
  next()
})

export default router

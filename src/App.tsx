/*
 * @Author: Innei
 * @Date: 2020-11-18 21:58:23
 * @LastEditTime: 2021-03-14 14:59:37
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/App.tsx
 * Mark: Coding with Love
 */
import { defineComponent, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'
import { configs } from '../configs'

export default defineComponent({
  setup() {
    document.title = `${configs.title} | ${configs.subtitle}`

    // FIXME: there is a way to use KeepAlive with RouterView in JSX??
    // how to make v-slot working in JSX
    return () => (
      <KeepAlive exclude={['note']}>
        <RouterView>
          <KeepAlive></KeepAlive>
        </RouterView>
      </KeepAlive>
    )
  },
})

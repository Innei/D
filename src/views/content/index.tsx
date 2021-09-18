/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getNoteContent } from 'api'
import { NoteModel } from 'graphql'
import BaseLayout from 'layouts/base.vue'
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { configs } from '../../../configs'
import './index.css'

export const NoteContentView = defineComponent({
  name: 'note',
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    const data = reactive({
      note: {} as NoteModel,
    })
    onUnmounted(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })
    onMounted(async () => {
      data.note = await getNoteContent(nid)
      document.title = data.note.title + ' | ' + configs.title

      const response = await fetch(
        `${'https://api.innei.ren' || configs.apiBase}/v2/markdown/render/${
          data.note.id
        }`,
        {},
      )

      const text = await response.text()
      const $html = document.getElementById('html')!
      try {
        const parser = new DOMParser()
        const $ = parser.parseFromString(text, 'text/html')
        const $article = $.querySelector('article')!

        const $h1 = $article.querySelector('h1')!
        $h1.style.cssText = `text-align:center`

        $html.appendChild($article)

        const $style = $.querySelectorAll('style')!
        $style.forEach((style) => {
          $html.prepend(style)
        })
      } catch (e) {
        console.error(e)
        $html.innerHTML = `<p>404</p>`
      }
    })

    return () => (
      <BaseLayout>{data.note.id && <div id="html"></div>}</BaseLayout>
    )
  },
})

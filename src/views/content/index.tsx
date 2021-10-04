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
        `${configs.apiBase}/v2/markdown/render/structure/${data.note.id}`,
        {},
      )

      const json = await response.json()

      const { body, script, link, extra_scripts: extraScripts } = json

      const $html = document.getElementById('html')!
      try {
        $html.innerHTML = `${extraScripts.join('')}<script>${script.join(
          ';',
        )}</script>${link.join('')}${body}`
      } catch (e) {
        console.error(e)
        $html.innerHTML = `<p>404</p>`
      }
    })

    return () => (
      <BaseLayout>
        {data.note.id && (
          <div id="html" class="content-wrapper">
            Loading...
          </div>
        )}
      </BaseLayout>
    )
  },
})

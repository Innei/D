/*
 * @Author: Innei
 * @Date: 2020-11-18 19:02:42
 * @LastEditTime: 2021-03-14 13:44:08
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/views/content/index.tsx
 * Mark: Coding with Love
 */
import { computed, defineComponent, onMounted, reactive } from 'vue'
import './index.css'
import BaseLayout from 'layouts/base.vue'
import { useRoute } from 'vue-router'
import { getNoteContent } from 'api'
import { NoteContentPayload } from 'api/types'
import { configs } from '../../../configs'
import html from 'remark-html'
/// NOTICE: must use old version of remark and unified, because latest unified breaking change many apis.
// @ts-ignore
import markdown from 'remark-parse'
import unified from 'unified'
import gfm from 'remark-gfm'
import rules from 'utils/rules'
const parser = unified()
  .use(markdown)
  .use(gfm)
  .use(rules)
  .use(html, {
    handlers: {
      spoiler: (h, node) => {
        return h(
          node,
          'del',
          {
            class: 'spoiler',
          },
          [
            {
              type: 'text',
              value: node.value,
            },
          ],
        )
      },
    },
  })
export const NoteContentView = defineComponent({
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    const data = reactive({
      note: {} as NoteContentPayload,
    })
    onMounted(async () => {
      data.note = await getNoteContent(nid)
      document.title = data.note.title + ' | ' + configs.title
    })

    const formatTime = computed(() => {
      const d = new Date(data.note.created)

      const day = d.getDate()
      const month = d.getMonth() + 1
      const y = d.getFullYear()

      return `${y}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    })

    return () => (
      <BaseLayout>
        {data.note._id && (
          <div class={'content-wrapper'}>
            <h1>{data.note.title}</h1>
            <div class={'time'}>{formatTime.value}</div>
            <article>
              <h1 style={{ display: 'none' }}>{data.note.title}</h1>
              <div
                innerHTML={parser.processSync(data.note.text).toString()}
              ></div>
            </article>

            <div class={'notice'}>
              Visit Full version:{' '}
              <a
                href={`//innei.ren/notes/${data.note.nid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                https://innei.ren/notes/{data.note.nid}
              </a>
            </div>
          </div>
        )}
      </BaseLayout>
    )
  },
})

import Markdown from 'markdown-to-jsx-vue3'
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import BaseLayout from '@/layouts/base.vue'
import { useNoteDetail } from '@/store'

import { configs } from '../../configs'

export const NoteContentView = defineComponent({
  name: 'note-view',
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    onUnmounted(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })

    const noteDetail = useNoteDetail(nid)

    const { dataRef, loadingRef, notePromise } = noteDetail
    onMounted(async () => {
      notePromise.then((note) => {
        document.title = `${note.title} | ${configs.title}`
      })
    })

    return () => {
      const data = dataRef.value
      return (
        <BaseLayout>
          {data ? (
            <>
              <div class={'prose !max-w-max'}>
                <h1>{data.title}</h1>
                <Markdown>{data.text}</Markdown>
              </div>

              <p class={'mt-12 text-right text-sm'}>
                去原文地址获得更好阅读体验：{' '}
                <a href={`${configs.previewHost}/notes/${data.nid}`}>
                  {`${configs.previewHost}/notes/${data.nid}`}
                </a>
              </p>
            </>
          ) : (
            <div>loading...</div>
          )}
        </BaseLayout>
      )
    }
  },
})

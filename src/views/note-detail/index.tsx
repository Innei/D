import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { BaseLayout } from '@/layouts'
import { ArticleRender } from '@/modules/render/article'
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

    const { dataRef, notePromise } = noteDetail
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
            <ArticleRender
              {...data}
              rawLink={`${configs.previewHost}/notes/${data.nid}`}
            />
          ) : (
            <div>loading...</div>
          )}
        </BaseLayout>
      )
    }
  },
})

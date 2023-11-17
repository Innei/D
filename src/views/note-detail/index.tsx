import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import { useTitle } from '@/composable/use-title'
import { ArticleRender } from '@/modules/render/article'
import { useNoteDetail } from '@/store'

import { configs } from '../../configs'

export const NoteContentView = defineComponent({
  name: 'note-view',
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    const noteDetail = useNoteDetail(nid)

    const { dataRef, notePromise } = noteDetail

    const titler = useTitle()
    notePromise.then((page) => {
      titler(page.title)
    })
    return () => {
      const data = dataRef.value
      return (
        <>
          {data ? (
            <ArticleRender
              {...data}
              rawLink={`${configs.previewHost}/notes/${data.nid}`}
            />
          ) : (
            <div>loading...</div>
          )}
        </>
      )
    }
  },
})

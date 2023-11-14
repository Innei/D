import { defineComponent, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { NoteModel } from '@mx-space/api-client'
import type { PropType } from 'vue'

import { PaginationLayout } from '@/layouts/pagination'
import { ItemBase } from '@/modules/home/item-base'
import { useNoteList } from '@/store'

export const NoteList = defineComponent({
  setup() {
    const route = useRoute()

    const pageRef = ref(1)
    const sizeRef = ref(10)

    watchEffect(() => {
      pageRef.value = Number(route.query.page) || 1
      sizeRef.value = Number(route.query.size) || 10
    })

    const noteList = useNoteList({
      pageRef,
      sizeRef,
    })

    return () => {
      const { data, pagination } = noteList.value
      return (
        <PaginationLayout pagination={pagination}>
          {{
            default() {
              return (
                <>
                  {data.map((note, i) => {
                    return <NoteItem note={note} index={i} key={note.id} />
                  })}
                </>
              )
            },
          }}
        </PaginationLayout>
      )
    }
  },
})

const NoteItem = defineComponent({
  props: {
    note: {
      type: Object as PropType<NoteModel>,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () => {
      const note = props.note
      return (
        <ItemBase {...note} index={props.index} to={`/notes/${note.nid}`} />
      )
    }
  },
})

import { defineComponent, ref, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import './index.css'

import clsx from 'clsx'
import { useNoteList } from 'store'

export const NoteList = defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

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
        <>
          <ul class={'list-root'}>
            {data.map((note) => {
              const created = new Date(note.created)
              const day = created.getDate()
              const month = created.getMonth() + 1
              return (
                <li key={note.nid}>
                  <RouterLink to={`/notes/${note.nid}`}>
                    <span class={'title'}>{note.title}</span>
                    <span class={'created'}>{`${month}/${day}`}</span>
                  </RouterLink>
                </li>
              )
            })}
          </ul>
          <div class={'pager'}>
            <div
              class={clsx('prev', !pagination.hasPrev && 'disable')}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.page - 1,
                  },
                })
              }}
            >
              上一页
            </div>
            <div
              class={clsx('next', !pagination.hasNext && 'disable')}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.page + 1,
                  },
                })
              }}
            >
              下一页
            </div>
          </div>
        </>
      )
    }
  },
})

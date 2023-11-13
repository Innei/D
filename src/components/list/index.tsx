import { defineComponent, ref, watchEffect, withDirectives } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { MotionDirective } from '@vueuse/motion'

import './index.css'

import clsx from 'clsx'

import { useNoteList } from '@/store'

export const NoteList = defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()

    const pageRef = ref(1)
    const sizeRef = ref(10)

    watchEffect(() => {
      pageRef.value = Number(route.query.page) || 1
      sizeRef.value = Number(route.query.size) || 15
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
            {data.map((note, i) => {
              const created = new Date(note.created)
              const day = created.getDate()
              const month = created.getMonth() + 1
              return (
                <li key={note.nid}>
                  {withDirectives(
                    <RouterLink
                      class={'inline-block'}
                      to={`/notes/${note.nid}`}
                    >
                      <span class={'title'}>{note.title}</span>
                      <span class={'created'}>{`${month}/${day}`}</span>
                    </RouterLink>,
                    [
                      [
                        MotionDirective({
                          initial: { opacity: 0.011, y: 50 },
                          enter: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 300,
                              delay: i * 50,
                              type: 'spring',
                              stiffness: '100',
                            },
                          },
                        }),
                      ],
                    ],
                  )}
                </li>
              )
            })}
          </ul>
          <div class={'pager'}>
            <div
              class={clsx('prev', !pagination.hasPrevPage && 'disable')}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.currentPage - 1,
                  },
                })
              }}
            >
              上一页
            </div>
            <div
              class={clsx('next', !pagination.hasNextPage && 'disable')}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.currentPage + 1,
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

import clsx from 'clsx'
import { defineComponent, ref, watchEffect, withDirectives } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useNoteList } from '@/store'
import { MotionDirective } from '@vueuse/motion'

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
          <ul class={'py-2 min-h-[500px]'}>
            {data.map((note, i) => {
              const created = new Date(note.created)
              const day = created.getDate()
              const month = created.getMonth() + 1
              return (
                <li
                  key={note.nid}
                  class={
                    'leading-[1.8] duration-150 transition-transform hover:(transform translate-x-4)'
                  }
                >
                  {withDirectives(
                    <RouterLink
                      class={'inline-block'}
                      to={`/notes/${note.nid}`}
                    >
                      <span class={'text-lg'}>{note.title}</span>
                      <span
                        class={'ml-4 text-sm text-opacity-[0.85]'}
                      >{`${month}/${day}`}</span>
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
          <div
            class={
              'flex justify-between my-16 px-8 [&_div]:cursor-pointer [&_.disable]:(cursor-not-allowed text-gray-800 opacity-20)'
            }
          >
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

import clsx from 'clsx'
import RemoveMarkdown from 'remove-markdown'
import { defineComponent, ref, watchEffect, withDirectives } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { NoteModel } from '@mx-space/api-client'
import type { PropType } from 'vue'

import { useNoteList } from '@/store'
import { ellipsis } from '@/utils/text'
import { MotionDirective } from '@vueuse/motion'

import { RelativeTime } from '../../../components/ui/relative-time'

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
          <ul class={'py-2 min-h-[500px]'}>
            {data.map((note, i) => {
              return <NoteItem note={note} index={i} key={note.id} />
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
        <li key={note.nid}>
          {withDirectives(
            <RouterLink
              class={clsx(
                'duration-150 transition-all rounded-lg block',
                'p-3 -mx-3 hover:(bg-accent-500/10 cursor-pointer)',
                'group',
              )}
              to={`/notes/${note.nid}`}
            >
              <div class={'flex flex-col gap-2'}>
                <div class={'flex justify-between'}>
                  <div class={'flex gap-2 items-center'}>
                    <span class={'text-lg'}>{note.title}</span>

                    <span
                      class={clsx(
                        'i-mingcute-external-link-line text-xm group-hover:(opacity-100 translate-x-0) duration-200 transition-all opacity-0 translate-x-[-10px]',
                        '!text-accent-600-darker/90',
                      )}
                    />
                  </div>
                  <span
                    class={
                      'ml-4 text-sm text-opacity-[0.85] flex-shrink-0 tabular-nums text-xs'
                    }
                  >
                    <RelativeTime
                      date={note.created}
                      displayAbsoluteTimeAfterDay={7}
                    />
                  </span>
                </div>
                <p
                  class={
                    'text-black/80 dark:text-white/90 text-sm leading-[1.8]'
                  }
                >
                  {ellipsis(RemoveMarkdown(note.text), 120)}
                </p>
              </div>
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
                      delay: props.index * 50,
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
    }
  },
})

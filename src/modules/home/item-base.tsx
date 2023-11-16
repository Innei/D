import RemoveMarkdown from 'remove-markdown'
import { defineComponent, withDirectives } from 'vue'
import { RouterLink } from 'vue-router'

import { RelativeTime } from '@/components/ui/relative-time'
import { ellipsis } from '@/utils/text'
import { MotionDirective } from '@vueuse/motion'

export const ItemBase = defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    created: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () => {
      return (
        <li>
          {withDirectives(
            <RouterLink
              class={[
                'duration-150 transition-all rounded-lg block',
                'p-3 -mx-3 hover:(bg-accent-500/10 cursor-pointer)',
                'group',
              ]}
              to={props.to}
            >
              <div class={'flex flex-col gap-2'}>
                <div class={'flex justify-between'}>
                  <div class={'flex gap-2 items-center'}>
                    <span class={'text-lg'}>{props.title}</span>

                    <span
                      class={[
                        'i-mingcute-external-link-line text-xm group-hover:(opacity-100 translate-x-0) duration-200 transition-all opacity-0 translate-x-[-10px]',
                        '!text-accent-600-darker/90',
                      ]}
                    />
                  </div>
                  <span
                    class={
                      'ml-4 text-sm text-opacity-[0.85] flex-shrink-0 tabular-nums text-xs'
                    }
                  >
                    <RelativeTime
                      date={props.created}
                      displayAbsoluteTimeAfterDay={7}
                    />
                  </span>
                </div>
                <p
                  class={
                    'text-black/80 dark:text-white/90 text-sm leading-[1.8]'
                  }
                >
                  {ellipsis(RemoveMarkdown(props.text), 120)}
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
                      delay: props.index * 50,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
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

import { defineComponent, withDirectives } from 'vue'

import { MotionDirective } from '@vueuse/motion'

export const UnstyledButton = defineComponent({
  setup(_, { slots, attrs }) {
    return () =>
      withDirectives(
        <button
          class="p-0 m-0 cursor-pointer text-current dark:text-current"
          {...attrs}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {slots.default?.()}
        </button>,
        [
          [
            MotionDirective({
              tapped: {
                scale: 0.95,
                transition: {
                  type: 'spring',
                },
              },
            }),
          ],
        ],
      )
  },
})

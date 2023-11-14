import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

export const UnstyledButton = defineComponent({
  props: {
    onClick: {
      type: Function as PropType<(payload: MouseEvent) => void>,
    },
  },
  setup(props, { slots, attrs }) {
    const target = ref<HTMLElement>()
    return () => (
      <button
        ref={target}
        class="p-0 m-0 cursor-pointer text-current dark:text-current"
        {...attrs}
        onClick={props.onClick}
      >
        {slots.default?.()}
      </button>
    )
  },
})

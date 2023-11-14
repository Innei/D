import clsx from 'clsx'
import { defineComponent, Transition } from 'vue'
import { RouterLink } from 'vue-router'

import { UnstyledButton } from '@/components/ui/button/unstyle'
import { useDark, useToggle } from '@vueuse/core'

import { configs } from '../../../configs'

export const Header = defineComponent({
  setup() {
    const isDark = useDark()
    const toggleDark = useToggle(isDark)

    return () => (
      <header class="my-8 flex items-center justify-between">
        <RouterLink to={'/'}>
          <h1 class="relative m-0 cursor-pointer">
            {configs.title}
            <small
              class={clsx(
                "absolute left-0 -bottom-5 m-0 whitespace-nowrap text-right font-['Heiti_SC'] text-sm text-gray-400 dark:text-gray-500",
                'sm:(relative ml-0 text-base text-current dark:text-current)',
              )}
            >
              {configs.subtitle}
            </small>
          </h1>
        </RouterLink>

        <div class="relative">
          <UnstyledButton
            onClick={() => {
              toggleDark()
            }}
          >
            <Transition
              // name="rotate"
              enterFromClass="rotate-enter-from"
              enterActiveClass="rotate-enter-active"
              leaveActiveClass="rotate-leave-active"
              leaveToClass="rotate-leave-to"
            >
              {!isDark.value ? (
                <i
                  key={'sun'}
                  class={'inline-block h-5 w-5 i-mingcute-sun-line'}
                />
              ) : (
                <i
                  key={'dark'}
                  class={'inline-block h-5 w-5 i-mingcute-moon-line'}
                />
              )}
            </Transition>
          </UnstyledButton>
        </div>
      </header>
    )
  },
})

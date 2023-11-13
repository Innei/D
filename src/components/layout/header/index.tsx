import clsx from 'clsx'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { UnstyledButton } from '@/components/ui/button/unstyle'

import { configs } from '../../../configs'

export const Header = defineComponent({
  setup() {
    return () => (
      <header class="my-8 flex items-center justify-between">
        <RouterLink to={'/'}>
          <h1 class="relative m-0 cursor-pointer">
            {configs.title}
            <small
              class={clsx(
                "absolute left-0 -bottom-5 m-0 whitespace-nowrap text-right font-['Heiti_SC'] text-sm text-gray-400 dark:text-gray-600",
                'sm:(relative ml-0 text-base text-current dark:text-current)',
              )}
            >
              {configs.subtitle}
            </small>
          </h1>
        </RouterLink>

        <div class="relative">
          <UnstyledButton class={'inline-block h-5 w-5 i-mingcute-sun-line'} />
        </div>
      </header>
    )
  },
})

import { defineComponent } from 'vue'

import { BaseLayout } from '@/layouts'
import { HomeTabs } from '@/modules/home/tabs'

export const HomeView = defineComponent({
  setup() {
    return () => (
      <BaseLayout>
        <HomeTabs />
      </BaseLayout>
    )
  },
})

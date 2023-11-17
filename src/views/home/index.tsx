import { defineComponent } from 'vue'

import { HomeTabs } from '@/modules/home/tabs'

export const HomeView = defineComponent({
  setup() {
    return () => (
      <>
        <HomeTabs />
      </>
    )
  },
})

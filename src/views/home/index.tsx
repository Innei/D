import { defineComponent } from 'vue'

import { NoteList } from '@/components/list'
import BaseLayout from '@/layouts/base.vue'

import './index.css'

export const HomeView = defineComponent({
  setup() {
    return () => (
      <BaseLayout>
        <NoteList />
      </BaseLayout>
    )
  },
})

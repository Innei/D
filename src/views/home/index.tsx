import { NoteList } from 'components/list'
import BaseLayout from 'layouts/base.vue'
import { defineComponent } from 'vue'

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

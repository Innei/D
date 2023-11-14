import { defineComponent } from 'vue'

import { BaseLayout } from '@/layouts'
import { NoteList } from '@/modules/notes/list'

export const HomeView = defineComponent({
  setup() {
    return () => (
      <BaseLayout>
        <NoteList />
      </BaseLayout>
    )
  },
})

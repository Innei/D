import { defineComponent, KeepAlive, onActivated } from 'vue'
import { RouterView } from 'vue-router'

import { configs } from './configs'
import { useSyncStore } from './store'

export const App = defineComponent({
  setup() {
    const syncStore = useSyncStore()
    syncStore.sync()

    onActivated(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })

    return () => (
      <RouterView>
        {{
          default: ({ Component }: any) => {
            return <KeepAlive exclude={['note-view']}>{Component}</KeepAlive>
          },
        }}
      </RouterView>
    )
  },
})

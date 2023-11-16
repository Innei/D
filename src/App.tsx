import { defineComponent, KeepAlive, onActivated, Transition } from 'vue'
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
      <>
        <RouterView>
          {{
            default: ({ Component, route }: any) => {
              return (
                <Transition name={route.meta?.transition || 'slide-left'}>
                  <KeepAlive include={['home']}>{Component}</KeepAlive>
                </Transition>
              )
            },
          }}
        </RouterView>

        {syncStore.isSyncing && (
          <div
            class={[
              'fixed bottom-2 left-2 text-xs text-dark/80 dark:text-white/80 flex items-center gap-2',
              'border border-primary-400 dark:border-primary-700-darker p-1 rounded-xl',
              'animated-slide-in-up animate-both',
            ]}
          >
            <span class={'i-mingcute-loading-line h-4 w-4 animate-spin'} />
            <span>Syncing...</span>
          </div>
        )}
      </>
    )
  },
})

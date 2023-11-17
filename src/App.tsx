import { defineComponent, KeepAlive, onActivated, Transition } from 'vue'
import { RouterView } from 'vue-router'

import { useOnline } from '@vueuse/core'

import { configs } from './configs'
import { BaseLayout } from './layouts'
import { useSyncStore } from './store'

const styles = {
  status: [
    'fixed bottom-2 left-2 text-xs flex items-center gap-2',
    'animated-slide-in-up animate-both p-1 rounded-xl',
  ],
}
export const App = defineComponent({
  setup() {
    const syncStore = useSyncStore()
    syncStore.sync()

    const isOnline = useOnline()

    onActivated(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })

    return () => (
      <>
        <BaseLayout>
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
        </BaseLayout>

        {!isOnline.value && (
          <div
            class={[
              ...styles.status,
              'border border-red-400 dark:border-red-700 text-red-500/80',
            ]}
          >
            <span class={'i-mingcute-warning-line h-4 w-4'} />
            <span>You are offline</span>
          </div>
        )}
        {syncStore.isSyncing && (
          <div
            class={[
              ...styles.status,
              'border border-primary-400 dark:border-primary-700-darker',
              'text-dark/80 dark:text-white/80',
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

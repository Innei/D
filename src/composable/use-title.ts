import { onUnmounted } from 'vue'

import { configs } from '@/configs'

export const useTitle = () => (title: string) => {
  let f = false
  onUnmounted(() => {
    f = true
    document.title = `${configs.title} | ${configs.subtitle}`
  })

  return () => {
    if (f) return
    document.title = `${title} | ${configs.title}`
  }
}

import { acceptHMRUpdate, defineStore } from 'pinia'
import type { TopicRawModel } from '../models/db.raw'

import { createCollectionActions } from './utils/helper'

export const useTopicStore = defineStore('topic', {
  state() {
    return {
      collection: new Map<string, TopicRawModel>(),
    }
  },
  actions: {
    ...createCollectionActions(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useTopicStore, import.meta.hot)
  })
}

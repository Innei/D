import { acceptHMRUpdate, defineStore } from 'pinia'
import type { PostRawModel } from '../models/db.raw'

import { syncDb } from './modules/sync/db'
import { createCollectionActions } from './utils/helper'

export const usePostStore = defineStore('post', {
  state() {
    return {
      collection: new Map<string, PostRawModel>(),
    }
  },
  actions: {
    ...createCollectionActions(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(usePostStore, import.meta.hot)
  })
}

syncDb.post.hook('creating', (primaryKey, obj) => {
  const topicStore = usePostStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.post.hook('updating', (modifications, primaryKey, obj) => {
  const topicStore = usePostStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.post.hook('deleting', (primaryKey, obj) => {
  const topicStore = usePostStore()
  topicStore.collection.delete(obj.id)
})

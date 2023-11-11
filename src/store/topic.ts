import { acceptHMRUpdate, defineStore } from 'pinia'
import type { TopicRawModel } from '../models/db.raw'

import { syncDb } from './modules/sync/db'
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

syncDb.topic.hook('creating', (primaryKey, obj, transaction) => {
  const topicStore = useTopicStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.topic.hook('updating', (modifications, primaryKey, obj, transaction) => {
  const topicStore = useTopicStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.topic.hook('deleting', (primaryKey, obj, transaction) => {
  const topicStore = useTopicStore()
  topicStore.collection.delete(obj.id)
})

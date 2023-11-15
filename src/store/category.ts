import { acceptHMRUpdate, defineStore } from 'pinia'
import type { CategoryRawModel } from '../models/db.raw'

import { syncDb } from './modules/sync/db'
import { createCollectionActions } from './utils/helper'

export const useCategoryStore = defineStore('category', {
  state() {
    return {
      collection: new Map<string, CategoryRawModel>(),
    }
  },
  getters: {
    slugMap: (state) => {
      return new Map(
        [...state.collection.values()].map((category) => [
          category.slug,
          category,
        ]),
      )
    },
  },
  actions: {
    ...createCollectionActions(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useCategoryStore, import.meta.hot)
  })
}

syncDb.category.hook('creating', (primaryKey, obj) => {
  const topicStore = useCategoryStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.category.hook('updating', (modifications, primaryKey, obj) => {
  const topicStore = useCategoryStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.category.hook('deleting', (primaryKey, obj) => {
  const topicStore = useCategoryStore()
  topicStore.collection.delete(obj.id)
})

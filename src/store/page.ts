import { acceptHMRUpdate, defineStore } from 'pinia'
import type { PageRawModel } from '@/models/db.raw'

import { syncDb } from './modules/sync/db'
import { createCollectionActions } from './utils/helper'

export const usePageStore = defineStore('page', {
  state() {
    return {
      collection: new Map<string, PageRawModel>(),
    }
  },
  actions: {
    ...createCollectionActions(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(usePageStore, import.meta.hot)
  })
}

syncDb.page.hook('creating', (primaryKey, obj) => {
  const pageStore = usePageStore()

  pageStore.collection.set(obj.id, obj)
})

syncDb.page.hook('updating', (modifications, primaryKey, obj) => {
  const pageStore = usePageStore()

  pageStore.collection.set(obj.id, obj)
})

syncDb.page.hook('deleting', (primaryKey, obj) => {
  const pageStore = usePageStore()
  pageStore.collection.delete(obj.id)
})

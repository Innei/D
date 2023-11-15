import Dexie from 'dexie'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { SyncableCollectionName } from './constants'
import type { SyncCollectionData } from './types'

import { useCategoryStore } from '@/store/category'
import { usePageStore } from '@/store/page'
import { usePostStore } from '@/store/post'
import { useStorage } from '@vueuse/core'

import { useNoteStore } from '../../note'
import { useTopicStore } from '../../topic'
import { SYNC_DB_NAME } from './constants'
import { pourToDb, syncDb } from './db'
import { downloadDataAsStream } from './helper'

const lastSyncTime = useStorage('lastSyncTime', 0)

const getStores = () => {
  return {
    note: useNoteStore(),
    topic: useTopicStore(),
    page: usePageStore(),
    post: usePostStore(),
    category: useCategoryStore(),
  }
}

export const useSyncStore = defineStore('sync', {
  state: () => {
    return {
      isSyncing: false,
      isReady: false,
    }
  },
  actions: {
    async sync() {
      if (this.isSyncing) return

      const hasDb = await Dexie.exists(SYNC_DB_NAME)
      if (lastSyncTime.value && hasDb) {
        await this.pourDataIntoStore()
        this.isReady = true

        this.syncData()
      } else {
        lastSyncTime.value = 0
        this.buildCollection()
      }
    },
    async pourDataIntoStore() {
      for (const [type, store] of Object.entries(getStores())) {
        const collection =
          await syncDb[type as SyncableCollectionName].toArray()
        collection.forEach((item) => {
          ;(store as any).add(item)
        })
      }

      this.isReady = true
    },
    async syncData() {
      if (this.isSyncing) return
      this.isSyncing = true
      const currentSyncTime = Date.now()
      await downloadDataAsStream<
        | SyncCollectionData
        | { deleted: { type: SyncableCollectionName; id: string }[] }
      >({
        endpoint: `/sync/delta?lastSyncedAt=${new Date(
          lastSyncTime.value,
        ).toISOString()}`,
        onData(data) {
          if ('deleted' in data) {
            const { deleted } = data
            for (const deleteItem of deleted) {
              syncDb[deleteItem.type].delete(deleteItem.id)
            }
            return
          } else {
            pourToDb(data)
          }
        },
        onDone: () => {
          this.isSyncing = false
          lastSyncTime.value = currentSyncTime
        },
        onFail: (error) => {
          console.error(error)
          this.isSyncing = false
        },
      })
    },
    async buildCollection() {
      if (this.isSyncing) return
      this.isSyncing = true
      lastSyncTime.value = Date.now()
      try {
        for (const table of syncDb.tables) {
          await table.clear()
        }

        await downloadDataAsStream({
          endpoint: '/sync/collection',
          onData: pourToDb,
        })
      } catch {
        lastSyncTime.value = 0
        this.isSyncing = false
        return
        // fail
      }
      this.isReady = true
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useSyncStore, import.meta.hot)
  })
}

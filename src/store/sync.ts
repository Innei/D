import Dexie from 'dexie'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { apiClient } from 'utils/client'
import type { Table } from 'dexie'
import type {
  CategoryRawModel,
  NoteRawModel,
  PageRawModel,
  PostRawModel,
  TopicRawModel,
} from '../models/db.raw'

import { useStorage } from '@vueuse/core'

import { useNoteStore } from './note'
import { useTopicStore } from './topic'

const lastSyncTime = useStorage('lastSyncTime', 0)

export class SchemadDexie extends Dexie {
  note!: Table<NoteRawModel>
  topic!: Table<TopicRawModel>
  post!: Table<PostRawModel>
  category!: Table<CategoryRawModel>
  page!: Table<PageRawModel>
  'checksum_item'!: Table<{ id: string; checksum: string }>
  'checksum_collection'!: Table<{ id: string; checksum: string }>

  constructor() {
    super('nai-db')
    this.version(1).stores({
      note: 'id,nid',
      topic: 'id',
      post: 'id',
      category: 'id',
      page: 'id',
      checksum_item: 'id',
      checksum_collection: 'id',
    })
  }
}

export const syncDb = new SchemadDexie()

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

      if (lastSyncTime.value) {
        await this.pourDataIntoStore()

        this.syncData()
      } else {
        this.buildCollection()
      }
    },
    async pourDataIntoStore() {
      const noteStore = useNoteStore()
      await syncDb.note.toArray().then((notes) => {
        notes.forEach((note) => {
          noteStore.add(note)
        })
      })
      const topicStore = useTopicStore()
      await syncDb.topic.toArray().then((topics) => {
        topics.forEach((topic) => {
          topicStore.add(topic)
        })
      })
    },
    async syncData() {},
    async buildCollection() {
      this.isSyncing = true
      lastSyncTime.value = Date.now()
      try {
        for (const table of syncDb.tables) {
          await table.clear()
        }

        await downloadDataAsStream({
          onData: handleData,
        })
      } catch {
        lastSyncTime.value = 0
        this.isSyncing = false
        return
        // fail
      }
      this.isReady = true

      function handleData(data: SyncCollectionData) {
        data.data.id = data.data._id

        syncDb.checksum_item.put({
          id: data.data.id,
          checksum: data.checksum,
        })
        switch (data.type) {
          case 'note': {
            const noteStore = useNoteStore()
            noteStore.add(data.data)
            syncDb.note.put(data.data as NoteRawModel)

            break
          }
          case 'topic': {
            const topicStore = useTopicStore()
            topicStore.add(data.data)
            syncDb.topic.put(data.data as TopicRawModel)
            break
          }
          case 'post': {
            syncDb.post.put(data.data as PostRawModel)
            break
          }
          case 'category': {
            syncDb.category.put(data.data as CategoryRawModel)
            break
          }
          case 'page': {
            syncDb.page.put(data.data as PageRawModel)
            break
          }
        }
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useSyncStore, import.meta.hot)
  })
}

type Merge<T, U> = Omit<T, keyof U> & U
type SyncCollectionData = Merge<
  | {
      type: 'note'
      data: NoteRawModel
    }
  | {
      type: 'post'
      data: PostRawModel
    }
  | {
      type: 'category'
      data: CategoryRawModel
    }
  | {
      type: 'topic'
      data: TopicRawModel
    }
  | {
      type: 'page'
      data: PageRawModel
    },
  {
    checksum: string
  }
>

// 使用 Axios 获取流式数据
async function downloadDataAsStream({
  onData,
  onDone,
  onFail,
}: {
  onData: (data: SyncCollectionData) => void
  onDone?: () => void
  onFail?: (error: Error) => void
}): Promise<void> {
  const response = await fetch(`${apiClient.endpoint}/sync/collection`)

  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let received = ''

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        onDone?.()
        break
      }

      const str = decoder.decode(value, { stream: true })
      received += str

      const lines = received.split('\n')
      received = lines.pop() || '' // 保存最后一个不完整的片段

      lines.forEach((line) => {
        if (line) {
          try {
            const json: SyncCollectionData = JSON.parse(line)
            // 对每个 JSON 对象进行处理

            onData(json)
          } catch (error) {
            console.error('Error parsing JSON line:', error)
          }
        }
      })
    }
  } catch (error) {
    console.error('Stream reading failed:', error)
    onFail?.(error as any)
  } finally {
    reader.releaseLock()
  }
}

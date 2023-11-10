import { acceptHMRUpdate, defineStore } from 'pinia'
import { apiClient } from 'utils/client'
import type {
  CategoryRawModel,
  NoteRawModel,
  PageRawModel,
  PostRawModel,
  TopicRawModel,
} from '../models/db.raw'

import { useNoteStore } from './note'
import { useTopicStore } from './topic'

export const useSyncStore = defineStore('sync', {
  state: () => {
    return {
      isSyncing: false,
      isReady: false,
    }
  },
  actions: {
    async buildCollection() {
      this.isSyncing = true
      await downloadDataAsStream({
        onData: handleData,
      })

      this.isSyncing = false
      this.isReady = true

      function handleData(data: SyncCollectionData) {
        data.data.id = data.data._id
        switch (data.type) {
          case 'note': {
            const noteStore = useNoteStore()
            noteStore.add(data.data)
            break
          }
          case 'topic': {
            const topicStore = useTopicStore()
            topicStore.add(data.data)
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

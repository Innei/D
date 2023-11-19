import type { SyncCollectionData } from './types'

import { apiClient } from '@/utils/client'
import { queryClient } from '@/utils/query'

export async function downloadDataAsStream<ResponseType = SyncCollectionData>({
  endpoint,
  onData,
  onDone,
  onFail,
}: {
  endpoint: string
  onData: (data: ResponseType) => void
  onDone?: () => void
  onFail?: (error: Error) => void
}): Promise<void> {
  const response = await fetch(`${apiClient.endpoint}${endpoint}`).catch(
    (error) => {
      onFail?.(error)
      throw error
    },
  )

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

        if (!value) break
      }

      const str = decoder.decode(value, { stream: true })

      received += str

      const lines = received.split('\n')

      received = lines.pop() || '' // 保存最后一个不完整的片段

      lines.forEach((line) => {
        if (!line) return

        try {
          const json: ResponseType = JSON.parse(line)
          // 对每个 JSON 对象进行处理
          onData(json)
        } catch (error) {
          console.error('Error parsing JSON line:', error)
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

export const compareChecksum = async (type: string, refId: string) => {
  return queryClient.fetchQuery({
    queryKey: ['sync', 'checksum', type, refId],
    queryFn: async () => {
      const checksum = await fetch(
        `${apiClient.proxy.sync.checksum.toString(true)}?${new URLSearchParams({
          type,
          id: refId,
        }).toString()}`,
        {},
      ).then((res) => res.text())
      return checksum
    },
  })
}

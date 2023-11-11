import Dexie from 'dexie'
import { apiClient } from 'utils/client'
import type { Table } from 'dexie'
import type {
  CategoryRawModel,
  NoteRawModel,
  PageRawModel,
  PostRawModel,
  TopicRawModel,
} from '../../../models/db.raw'
import type { SyncableCollectionName } from './constants'
import type { SyncCollectionData } from './types'

import { SYNC_DB_NAME } from './constants'

export class SchemadDexie extends Dexie {
  note!: Table<NoteRawModel>
  topic!: Table<TopicRawModel>
  post!: Table<PostRawModel>
  category!: Table<CategoryRawModel>
  page!: Table<PageRawModel>
  'checksum_item'!: Table<{ id: string; checksum: string; type: string }>
  'checksum_collection'!: Table<{ id: string; checksum: string }>

  constructor() {
    super(SYNC_DB_NAME)
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

export const pourToDb = (data: SyncCollectionData) => {
  data.data.id = data.data._id

  syncDb.checksum_item.put({
    id: data.data.id,
    checksum: data.checksum,
    type: data.type,
  })
  syncDb[data.type].put(data.data as any)
}

export const getCurrentChecksum = async (id: string) => {
  return syncDb.checksum_item.get(id).then((item) => item?.checksum)
}

export const updateDocument = async (
  id: string,
  type: SyncableCollectionName,
) => {
  const data = await fetch(
    `${apiClient.proxy.sync.item.toString(true)}?${new URLSearchParams({
      id,
      type,
    }).toString()}`,
  )
    .then((res) => res.text())
    .then((text) => JSON.parse(text) as SyncCollectionData)

  if (!data) return
  pourToDb(data)
}

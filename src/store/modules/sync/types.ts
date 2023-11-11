import type {
  CategoryRawModel,
  NoteRawModel,
  PageRawModel,
  PostRawModel,
  TopicRawModel,
} from '../../../models/db.raw'

type Merge<T, U> = Omit<T, keyof U> & U
export type SyncCollectionData = Merge<
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

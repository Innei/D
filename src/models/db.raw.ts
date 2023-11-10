import type {
  CategoryModel,
  NoteModel,
  PageModel,
  PostModel,
  TopicModel,
} from '@mx-space/api-client'

type Id = string
interface WithMongoId {
  _id: Id
}
export type NoteRawModel = Omit<NoteModel, 'topic'> & {
  topicId: Id
} & WithMongoId

export type CategoryRawModel = CategoryModel & WithMongoId

export type PostRawModel = Omit<PostModel, 'category' | 'related'> & {
  categoryId: Id
  related: Id[]
} & WithMongoId

export type TopicRawModel = TopicModel & WithMongoId

export type PageRawModel = PageModel & WithMongoId

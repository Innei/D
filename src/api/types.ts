export interface Pager {
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type NoteListPayload = {
  created: string
  title: string
  nid: number
  _id: number
}[]

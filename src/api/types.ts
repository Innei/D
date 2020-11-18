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

export type NoteContentPayload = {
  title: string
  created: string
  modified: string
  text: string
  nid: number
  _id: string
}

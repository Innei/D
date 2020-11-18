import { gql, GraphQLClient } from 'graphql-request'
import { configs } from '../../configs'
import { NoteContentPayload, NoteListPayload, Pager } from './types'
const client = new GraphQLClient(configs.apiBase, {})
export const getNoteList = async (page = 1, size = 10) => {
  const query = gql`
    query getNoteList($page: Int, $size: Int) {
      getNotesWithPager(page: $page, size: $size) {
        data {
          created
          title
          nid
          _id
        }
        pager {
          hasNextPage
          hasPrevPage
          totalPage
        }
      }
    }
  `

  const payload = await client.request(query, {
    page,
    size,
  })

  return {
    data: payload.getNotesWithPager.data as NoteListPayload,
    pager: payload.getNotesWithPager.pager as Pager,
  }
}

export const getNoteContent = async (nid: number) => {
  const query = gql`
    query getNoteContent($nid: Int) {
      getNoteById(nid: $nid) {
        data {
          title
          created
          modified
          text
          nid
          _id
        }
      }
    }
  `

  const payload = await client.request(query, {
    nid,
  })

  return payload.getNoteById.data as NoteContentPayload
}

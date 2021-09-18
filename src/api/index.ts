import { NoteModel, Paginator } from 'graphql'
import { gql, GraphQLClient } from 'graphql-request'
import { configs } from '../../configs'
const client = new GraphQLClient(configs.apiBase + '/graphql', {})
export const getNoteList = async (page = 1, size = 10) => {
  const query = gql`
    query getNoteList($page: Int, $size: Int) {
      getNotesWithPager(page: $page, size: $size) {
        data {
          created
          title
          nid
          id
        }
        pagination {
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
    data: payload.getNotesWithPager.data as NoteModel[],
    pagination: payload.getNotesWithPager.pagination as Paginator,
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
          id
        }
      }
    }
  `

  const payload = await client.request(query, {
    nid,
  })

  return payload.getNoteById.data as NoteModel
}

export const getNoteId = async (nid: number) => {
  const query = gql`
  query getNoteId($nid: Int) {
    getNoteById(nid: $nid) {
      data:{
        id
      }
    }
  }
  `

  const payload = await client.request(query, {
    nid,
  })
  return payload.getNoteById.data.id
}

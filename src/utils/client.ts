import {
  createClient,
  IRequestAdapter,
  NoteController,
  PostController,
} from '@mx-space/api-client'
import { configs } from 'configs'

//@ts-ignore
const adapter: IRequestAdapter = {
  default: fetch,
}

;(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const).forEach((method) => {
  //@ts-ignore
  adapter[method.toLowerCase()] = (url, options) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: method as string,
        body: options?.data ? JSON.stringify(options.data) : undefined,
      })
        .then((res) => {
          return res.json()
        })
        .catch((err) => {
          reject(err)
        })
        .then((json) => {
          resolve({ data: json })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
})

export const client = createClient(adapter)(configs.apiBase, {
  controllers: [PostController, NoteController],
})

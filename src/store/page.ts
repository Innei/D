import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, onBeforeMount, ref, unref, watch } from 'vue'
import type { PageRawModel } from '@/models/db.raw'
import type { PageModel } from '@mx-space/api-client'

import { apiClient } from '@/utils/client'

import { getCurrentChecksum, syncDb, updateDocument } from './modules/sync/db'
import { compareChecksum } from './modules/sync/helper'
import { createCollectionActions } from './utils/helper'

export const usePageStore = defineStore('page', {
  state() {
    return {
      collection: new Map<string, PageRawModel>(),
    }
  },
  getters: {
    list: (state) => {
      return [...state.collection.values()]
    },
  },
  actions: {
    getIdBySlug(slug: string) {
      return this.list.find((item) => item.slug === slug)?.id || null
    },
    ...createCollectionActions(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(usePageStore, import.meta.hot)
  })
}

syncDb.page.hook('creating', (primaryKey, obj) => {
  const pageStore = usePageStore()

  pageStore.collection.set(obj.id, obj)
})

syncDb.page.hook('updating', (modifications, primaryKey, obj) => {
  const pageStore = usePageStore()

  pageStore.collection.set(obj.id, obj)
})

syncDb.page.hook('deleting', (primaryKey, obj) => {
  const pageStore = usePageStore()
  pageStore.collection.delete(obj.id)
})

export const usePageDetail = (slug: string) => {
  const loadingRef = ref(true)
  const dataRef = ref<PageModel | null>(null)
  const dbDataRef = computed(getPageDetail)

  const pageStore = usePageStore()

  let promiseResolve: (value: PageModel) => void

  const pagePromise = new Promise<PageModel>((resolve) => {
    promiseResolve = resolve
  })

  watch(
    () => dbDataRef.value?.id,
    async () => {
      if (!dbDataRef.value) return

      if (!dataRef.value) {
        dataRef.value = unref(dbDataRef)
      }

      const [checksum, currentChecksum] = await Promise.all([
        compareChecksum('page', dbDataRef.value.id),
        getCurrentChecksum(dbDataRef.value.id),
      ])
      if (checksum !== currentChecksum) {
        console.log(
          'data is outdate. updating',
          `currentChecksum: ${currentChecksum}`,
          `remote: ${checksum}`,
        )
        updateDocument(dbDataRef.value.id, 'page')
      } else {
        dataRef.value = unref(dbDataRef)
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeMount(() => {
    if (!dbDataRef.value) {
      apiClient.page.getBySlug(slug).then((data) => {
        if (!dbDataRef.value) {
          dataRef.value = data
          loadingRef.value = false
          promiseResolve(data)
        }
      })
    } else {
      promiseResolve(dbDataRef.value)
    }
  })

  function getPageDetail() {
    const pageId = pageStore.getIdBySlug(slug)
    const data = pageStore.collection.get(pageId || '')

    if (!data) return null
    const pageModel = { ...data } as PageModel

    return pageModel
  }

  return {
    dataRef,
    loadingRef,
    pagePromise,
  }
}

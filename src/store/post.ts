import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, onBeforeMount, ref, unref, watch } from 'vue'
import type { PaginateResult, PostModel } from '@mx-space/api-client'
import type { Ref } from 'vue'
import type { PostRawModel } from '../models/db.raw'

import { apiClient } from '@/utils/client'
import { useQuery } from '@tanstack/vue-query'

import { useCategoryStore } from './category'
import { getCurrentChecksum, syncDb, updateDocument } from './modules/sync/db'
import { compareChecksum } from './modules/sync/helper'
import { createCollectionActions } from './utils/helper'

export const usePostStore = defineStore('post', {
  state() {
    return {
      collection: new Map<string, PostRawModel>(),
    }
  },
  getters: {
    list: (state) => {
      return [...state.collection.values()]
    },
    sortedList: (state) => {
      void state.collection
      return () => {
        return usePostStore().sortByCreated()
      }
    },
    slugMap: (state) => {
      return new Map(
        [...state.collection.values()].map((post) => [post.slug, post]),
      )
    },
  },

  actions: {
    ...createCollectionActions<PostRawModel>(),
    getBySlug(categorySlug: string, slug: string) {
      const categoryStore = useCategoryStore()
      const postStore = usePostStore()

      const category = categoryStore.slugMap.get(categorySlug)

      if (!category) {
        return null
      }
      const post = postStore.slugMap.get(slug)
      if (!post) {
        return null
      }
      const related = (post.related || []).map((i) => {
        return usePostModelFromDb(i)
      })
      return {
        ...post,
        category,
        related,
      } as PostModel
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(usePostStore, import.meta.hot)
  })
}

export const usePostModelFromDb = (
  id: string,
  options: {
    relatedDeep: number
  } = { relatedDeep: 1 },

  current = 0,
): PostModel | null => {
  const categoryStore = useCategoryStore()
  const postStore = usePostStore()

  const post = postStore.collection.get(id)
  if (!post) {
    return null
  }

  const category = categoryStore.collection.get(post.categoryId)
  if (!category) return null

  const related =
    current >= options.relatedDeep
      ? []
      : post.related?.map((i) => {
          return usePostModelFromDb(i, options, current + 1)
        }) || []

  return {
    ...post,
    category,
    related,
  } as PostModel
}
export const usePostList = ({
  pageRef,
  sizeRef,
}: {
  pageRef: Ref<number>
  sizeRef: Ref<number>
}) => {
  const postStore = usePostStore()

  const { data: remoteData, isLoading } = useQuery({
    queryKey: ['post', pageRef, sizeRef],
    queryFn: async () => {
      const data = await apiClient.post.getList(pageRef.value, sizeRef.value)
      return data
    },
  })

  const totalSize = computed(() => postStore.collection.size)
  return computed<PaginateResult<PostModel>>(() => {
    if (!isLoading.value && remoteData.value) {
      return remoteData.value
    }
    const page = pageRef.value
    const size = sizeRef.value

    return {
      data: [...postStore.sortByCreated()]
        .slice((page - 1) * size, page * size)
        .map((i) => usePostModelFromDb(i.id)),
      pagination: {
        hasNextPage: page * size < totalSize.value,
        hasPrevPage: page > 1,
        total: totalSize.value,
        totalPage: Math.ceil(totalSize.value / size),
        size,
        page,
        currentPage: page,
      },
    } as PaginateResult<PostModel>
  })
}

export const usePostDetail = (categorySlug: string, slug: string) => {
  const loadingRef = ref(true)
  const dataRef = ref<PostModel | null>(null)
  const dbDataRef = computed(getPostDetail)

  const postStore = usePostStore()

  let promiseResolve: (value: PostModel) => void

  const postPromise = new Promise<PostModel>((resolve) => {
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
        compareChecksum('post', dbDataRef.value.id),
        getCurrentChecksum(dbDataRef.value.id),
      ])
      if (checksum !== currentChecksum) {
        console.log(
          'data is outdate. updating',
          `currentChecksum: ${currentChecksum}`,
          `remote: ${checksum}`,
        )
        updateDocument(dbDataRef.value.id, 'post')
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
      apiClient.post.getPost(categorySlug, slug).then((post) => {
        if (!dbDataRef.value) {
          dataRef.value = post
          loadingRef.value = false
          promiseResolve(post)
        }
      })
    } else {
      promiseResolve(dbDataRef.value)
    }
  })

  function getPostDetail() {
    return postStore.getBySlug(categorySlug, slug)
  }
  return {
    loadingRef,
    dataRef,
    postPromise,
  }
}

syncDb.post.hook('creating', (primaryKey, obj) => {
  const postStore = usePostStore()

  postStore.collection.set(obj.id, obj)
})

syncDb.post.hook('updating', (modifications, primaryKey, obj) => {
  const postStore = usePostStore()

  postStore.collection.set(obj.id, obj)
})

syncDb.post.hook('deleting', (primaryKey, obj) => {
  const postStore = usePostStore()
  postStore.collection.delete(obj.id)
})

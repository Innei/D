import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import type { PaginateResult, PostModel } from '@mx-space/api-client'
import type { Ref } from 'vue'
import type { PostRawModel } from '../models/db.raw'

import { apiClient } from '@/utils/client'
import { useQuery } from '@tanstack/vue-query'

import { useCategoryStore } from './category'
import { syncDb } from './modules/sync/db'
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
  },

  actions: {
    ...createCollectionActions<PostRawModel>(),
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(usePostStore, import.meta.hot)
  })
}

export const usePostModelFromDb = (id: string): PostModel | null => {
  const categoryStore = useCategoryStore()
  const postStore = usePostStore()

  const post = postStore.collection.get(id)
  if (!post) {
    return null
  }
  return {
    ...post,
    category: categoryStore.collection.get(post.categoryId)!,
    related: post.related.map((i) => {
      return usePostModelFromDb(i)
    }),
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

syncDb.post.hook('creating', (primaryKey, obj) => {
  const topicStore = usePostStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.post.hook('updating', (modifications, primaryKey, obj) => {
  const topicStore = usePostStore()

  topicStore.collection.set(obj.id, obj)
})

syncDb.post.hook('deleting', (primaryKey, obj) => {
  const topicStore = usePostStore()
  topicStore.collection.delete(obj.id)
})

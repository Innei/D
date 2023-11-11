import { acceptHMRUpdate, defineStore } from 'pinia'
import { apiClient } from 'utils/client'
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { NoteModel } from '@mx-space/api-client'
import type { Ref } from 'vue'
import type { NoteRawModel } from '../models/db.raw'

import { getCurrentChecksum, syncDb, updateDocument } from './modules/sync/db'
import { compareChecksum } from './modules/sync/helper'
import { useTopicStore } from './topic'
import { createCollectionActions } from './utils/helper'

export const useNoteStore = defineStore('note', {
  state() {
    return {
      collection: new Map<string, NoteRawModel>(),
    }
  },

  getters: {
    list: (state) => {
      return [...state.collection.values()]
    },
    sortedList: (state) => {
      void state.collection
      return () => {
        return useNoteStore().sortByCreated()
      }
    },
  },

  actions: {
    getNidById(nid: number) {
      return this.list.find((item) => item.nid === nid)?.id || null
    },

    fetchNoteRemote(nid: number) {
      return apiClient.note.getNoteById(nid)
    },

    ...createCollectionActions<NoteRawModel>(),
  },
})

export const useNoteDetail = (nid: number) => {
  const loadingRef = ref(true)
  const dataRef = ref<NoteModel | null>(null)
  const dbDataRef = computed(getNoteDetail)

  const noteStore = useNoteStore()
  const topicStore = useTopicStore()

  let promiseResolve: (value: NoteModel) => void

  const notePromise = new Promise<NoteModel>((resolve) => {
    promiseResolve = resolve
  })

  watch(
    () => dbDataRef.value,
    async () => {
      if (!dbDataRef.value) return

      if (!dataRef.value) {
        dataRef.value = dbDataRef.value
        return
      }

      const [checksum, currentChecksum] = await Promise.all([
        compareChecksum('note', dbDataRef.value.id),
        getCurrentChecksum(dbDataRef.value.id),
      ])
      if (checksum !== currentChecksum) {
        console.log('data is outdate. updating')
        updateDocument(dbDataRef.value.id, 'note')
      } else {
        dataRef.value = dbDataRef.value
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeMount(() => {
    if (!dbDataRef.value) {
      apiClient.note.getNoteById(nid).then((note) => {
        if (!dbDataRef.value) {
          dataRef.value = note.data
          loadingRef.value = false
          promiseResolve(note.data)
        }
      })
    } else {
      promiseResolve(dbDataRef.value)
    }
  })

  function getNoteDetail() {
    const noteId = noteStore.getNidById(nid)
    const note = noteStore.collection.get(noteId || '')
    if (!note) return null
    const noteModel = { ...note } as NoteModel
    if (note.topicId) {
      noteModel.topic = topicStore.collection.get(note.topicId)
    }
    return noteModel
  }

  return {
    dataRef,
    loadingRef,
    notePromise,
  }
}

export const useNoteList = ({
  pageRef,
  sizeRef,
}: {
  pageRef: Ref<number>
  sizeRef: Ref<number>
}) => {
  const noteStore = useNoteStore()
  const totalSize = computed(() => noteStore.collection.size)
  return computed(() => {
    const page = pageRef.value
    const size = sizeRef.value
    return {
      data: [...noteStore.sortByCreated()].slice(
        (page - 1) * size,
        page * size,
      ),
      pagination: {
        hasNext: page * size < totalSize.value,
        hasPrev: page > 1,
        total: totalSize.value,
        totalPage: Math.ceil(totalSize.value / size),
        page,
      },
    }
  })
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useNoteStore, import.meta.hot)
  })
}

syncDb.note.hook('creating', (primaryKey, obj) => {
  const noteStore = useNoteStore()

  noteStore.collection.set(obj.id, obj)
})

syncDb.note.hook('updating', (modifications, primaryKey, obj) => {
  const noteStore = useNoteStore()

  noteStore.collection.set(obj.id, obj)
})

syncDb.note.hook('deleting', (primaryKey, obj) => {
  const noteStore = useNoteStore()
  noteStore.collection.delete(obj.id)
})

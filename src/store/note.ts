import { liveQuery } from 'dexie'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { apiClient } from 'utils/client'
import { onBeforeMount, ref, watch } from 'vue'
import type { NoteModel } from '@mx-space/api-client'
import type { NoteRawModel } from '../models/db.raw'

import { useObservable } from '@vueuse/rxjs'

import { syncDb, useSyncStore } from './sync'
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

    ...createCollectionActions(),
  },
})

export const useNoteDetail = (nid: number) => {
  const loadingRef = ref(true)
  const dataRef = ref(null as NoteModel | null)

  const noteStore = useNoteStore()
  const topicStore = useTopicStore()

  dataRef.value = getNoteDetail()

  let promiseResolve: (value: NoteModel) => void

  const notePromise = new Promise<NoteModel>((resolve) => {
    promiseResolve = resolve
  })

  watch(
    () => useSyncStore().isReady,
    (isReady) => {
      if (isReady) {
        dataRef.value = getNoteDetail()
        loadingRef.value = false
      }
    },
  )

  onBeforeMount(() => {
    if (!dataRef.value) {
      apiClient.note.getNoteById(nid).then((note) => {
        if (!dataRef.value) {
          dataRef.value = note.data
          loadingRef.value = false
          promiseResolve(note.data)
        }
      })
    } else {
      promiseResolve(dataRef.value)
    }
  })

  // TODO observe note update
  // How to observe note update? deep watch note collection, that will be a performance issue
  // watchEffect(() => {
  //   const noteId = dataRef.value?.id
  //   if (!noteId) return
  //   const note = noteStore.collection.get(noteId)

  // })

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

const useNoteDetailFromDb = (nid: number) => {
  const laodingRef = ref(true)
  const dataRef = useObservable<NoteModel>(
    liveQuery(() => {
      return syncDb.note
        .where('nid')
        .equals(nid)
        .first()
        .then(async (note) => {
          const noteModal = { ...note } as NoteModel
          if (note?.topicId) {
            const topic = await syncDb.topic.get(note.topicId)
            if (topic) {
              noteModal.topic = topic
            }
          }

          laodingRef.value = false
          return noteModal as NoteModel
        })
    }) as any,
  )
  return {
    dataRef,
    laodingRef,
  }
}

export const useNoteDetailNew = (nid: number) => {
  const { dataRef, laodingRef } = useNoteDetailFromDb(nid)
  if (!dataRef.value) {
    console.log('remote db loading....')
  }
}

export const useNoteList = (page = 1, size = 10) => {
  const noteStore = useNoteStore()
  return [...noteStore.collection.values()].slice(
    (page - 1) * size,
    page * size,
  )
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    acceptHMRUpdate(useNoteStore, import.meta.hot)
  })
}

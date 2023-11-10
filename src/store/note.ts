import { acceptHMRUpdate, defineStore } from 'pinia'
import { apiClient } from 'utils/client'
import { reactive, watch } from 'vue'
import type { NoteModel } from '@mx-space/api-client'
import type { NoteRawModel } from '../models/db.raw'

import { useSyncStore } from './sync'
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
  const { isReady } = useSyncStore()

  if (!isReady) {
    return null // TODO refetch remote
  }
  const noteStore = useNoteStore()

  const noteId = noteStore.getNidById(nid)
  const note = noteStore.collection.get(noteId || '')
  if (!note) return null
  const noteRective = reactive({ ...note } as NoteModel)
  if (note.topicId) {
    noteRective.topic = useTopicStore().collection.get(note.topicId)
    // watch
  }

  watch(
    () => note,
    () => {
      const newNote = noteStore.collection.get(noteId || '')
      if (!newNote) return
      Object.assign(noteRective, { ...newNote })
    },
  )

  return noteRective
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

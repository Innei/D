import { NoteListPayload } from '@/api/types'
import { defineComponent, PropType } from 'vue'
import { RouterLink } from 'vue-router'
import styles from './index.module.css'

export const NoteList = defineComponent({
  props: {
    notes: {
      type: Array as PropType<NoteListPayload>,
      required: true,
      default: [],
    },
  },
  setup(props) {
    return () => (
      <ul class={styles['root']}>
        {props.notes.map((note) => {
          const created = new Date(note.created)
          const day = created.getDate()
          const month = created.getMonth() + 1
          return (
            <li key={note._id}>
              <RouterLink to={`/notes/${note.nid}`}>
                <span class={styles['title']}>{note.title}</span>
                <span class={styles['created']}>{`${month}/${day}`}</span>
              </RouterLink>
            </li>
          )
        })}
      </ul>
    )
  },
})

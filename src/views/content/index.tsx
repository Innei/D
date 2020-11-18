import { computed, defineComponent, onMounted, reactive } from 'vue'
import styles from './index.module.css'
import BaseLayout from '@/layouts/base.vue'
import { useRoute } from 'vue-router'
import { getNoteContent } from '@/api'
import { NoteContentPayload } from '@/api/types'
export const NoteContentView = defineComponent({
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    const data = reactive({
      note: {} as NoteContentPayload,
    })
    onMounted(async () => {
      data.note = await getNoteContent(nid)
      document.title = data.note.title
    })

    const formatTime = computed(() => {
      const d = new Date(data.note.created)

      const day = d.getDate()
      const month = d.getMonth() + 1
      const y = d.getFullYear()

      return `${y}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    })

    return () => (
      <BaseLayout>
        {data.note._id && (
          <div class={styles['wrapper']}>
            <h1>{data.note.title}</h1>
            <div class={styles['time']}>{formatTime.value}</div>
            <article>
              <h1 style={{ display: 'none' }}>{data.note.title}</h1>

              <div>{data.note.text}</div>
            </article>
          </div>
        )}
      </BaseLayout>
    )
  },
})

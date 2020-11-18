import { getNoteList } from '@/api'
import { NoteListPayload, Pager } from '@/api/types'
import { NoteList } from '@/components/list'
import BaseLayout from '@/layouts/base.vue'
import router from '@/router'
import clsx from 'clsx'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import styles from './index.module.css'

export const HomeView = defineComponent({
  setup() {
    const loading = ref(true)
    const data = reactive({
      notes: [] as NoteListPayload,
      pager: {
        hasNextPage: false,
        hasPrevPage: false,
        totalPage: 1,
      } as Pager,
    })

    const route = useRoute()

    const currentPage = ref(parseInt(route.query.page as any) || 1)
    onMounted(async () => {
      await fetchData(currentPage.value, 20)
    })

    const fetchData = async (page = 1, size = 20) => {
      const payload = await getNoteList(page, size)
      data.notes = payload.data

      data.pager = payload.pager

      loading.value = false
      currentPage.value = page
    }

    return () => (
      <BaseLayout>
        <NoteList notes={data.notes} />

        {!loading.value && (
          <div class={styles['pager']}>
            <div
              class={clsx(
                styles['prev'],
                !data.pager.hasPrevPage && styles['disable'],
              )}
              onClick={() => {
                if (!data.pager.hasPrevPage) {
                  return
                }
                const page = currentPage.value - 1
                fetchData(page)
                router.push({
                  path: '/',
                  query: {
                    page: page,
                  },
                })
              }}
            >
              上一页
            </div>
            <div
              class={clsx(
                styles['next'],
                !data.pager.hasNextPage && styles['disable'],
              )}
              onClick={() => {
                if (!data.pager.hasNextPage) {
                  return
                }
                const page = currentPage.value + 1
                fetchData(page)
                router.push({
                  path: '/',
                  query: {
                    page,
                  },
                })
              }}
            >
              下一页
            </div>
          </div>
        )}
      </BaseLayout>
    )
  },
})

/*
 * @Author: Innei
 * @Date: 2020-11-18 15:42:12
 * @LastEditTime: 2021-03-14 11:08:31
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/views/home/index.tsx
 * Mark: Coding with Love
 */
import { getNoteList } from 'api'
import { NoteListPayload, Pager } from 'api/types'
import clsx from 'clsx'
import { NoteList } from 'components/list'
import BaseLayout from 'layouts/base.vue'
import router from 'router'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import './index.css'

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
      await fetchData(currentPage.value)
    })

    const fetchData = async (page = 1, size = 15) => {
      const payload = await getNoteList(page, size)
      data.notes = payload.data

      data.pager = payload.pagination

      loading.value = false
      currentPage.value = page
    }

    return () => (
      <BaseLayout>
        <NoteList notes={data.notes} />

        {!loading.value && (
          <div class={'pager'}>
            <div
              class={clsx('prev', !data.pager.hasPrevPage && 'disable')}
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
              class={clsx('next', !data.pager.hasNextPage && 'disable')}
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

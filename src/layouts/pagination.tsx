import { defineComponent, Fragment } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Pager } from '@mx-space/api-client'
import type { PropType } from 'vue'

export const PaginationLayout = defineComponent({
  props: {
    pagination: {
      type: Object as PropType<Pager>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const router = useRouter()
    const route = useRoute()
    return () => {
      const pagination = props.pagination
      return (
        <Fragment>
          <ul class={'py-2 min-h-[500px] flex flex-col gap-3'}>
            {slots.default?.()}
          </ul>
          <div
            class={
              'flex justify-between my-16 px-8 [&_div]:cursor-pointer [&_.disable]:(cursor-not-allowed text-gray-800 opacity-20)'
            }
          >
            <div
              class={['prev', !pagination.hasPrevPage && 'disable']}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.currentPage - 1,
                  },
                })
              }}
            >
              上一页
            </div>
            <div
              class={['next', !pagination.hasNextPage && 'disable']}
              onClick={() => {
                router.push({
                  query: {
                    ...route.query,
                    page: pagination.currentPage + 1,
                  },
                })
              }}
            >
              下一页
            </div>
          </div>
        </Fragment>
      )
    }
  },
})

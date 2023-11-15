import { defineComponent, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { PostModel } from '@mx-space/api-client'
import type { PropType } from 'vue'

import { PaginationLayout } from '@/layouts/pagination'
import { ItemBase } from '@/modules/home/item-base'
import { usePostList } from '@/store/post'

export const PostList = defineComponent({
  name: 'PostList',
  setup() {
    const pageRef = ref(1)
    const sizeRef = ref(10)
    const postList = usePostList({ pageRef, sizeRef })
    const route = useRoute()
    watchEffect(() => {
      pageRef.value = Number(route.query.page) || 1
      sizeRef.value = Number(route.query.size) || 10
    })
    return () => {
      const { data, pagination } = postList.value
      return (
        <PaginationLayout pagination={pagination}>
          {{
            default() {
              return (
                <>
                  {data.map((post, i) => {
                    return <PostItem post={post} index={i} key={post.id} />
                  })}
                </>
              )
            },
          }}
        </PaginationLayout>
      )
    }
  },
})

const PostItem = defineComponent({
  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () => {
      const post = props.post
      return (
        <ItemBase
          {...post}
          index={props.index}
          to={`/posts/${post.category.slug}/${post.slug}`}
        />
      )
    }
  },
})

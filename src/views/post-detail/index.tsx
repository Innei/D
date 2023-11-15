import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { BaseLayout } from '@/layouts'
import { ArticleRender } from '@/modules/render/article'
import { usePostDetail } from '@/store/post'

import { configs } from '../../configs'

export const PostContentView = defineComponent({
  name: 'post-view',
  setup() {
    const route = useRoute()

    const category = route.params.category as any
    const slug = route.params.slug as any

    onUnmounted(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })

    const postDetail = usePostDetail(category, slug)

    const { dataRef, notePromise } = postDetail
    onMounted(async () => {
      notePromise.then((post) => {
        document.title = `${post.title} | ${configs.title}`
      })
    })

    return () => {
      const data = dataRef.value
      return (
        <BaseLayout>
          {data ? (
            <ArticleRender
              {...data}
              rawLink={`${configs.previewHost}/posts/${category}/${slug}`}
            />
          ) : (
            <div>loading...</div>
          )}
        </BaseLayout>
      )
    }
  },
})

import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import { useTitle } from '@/composable/use-title'
import { ArticleRender } from '@/modules/render/article'
import { usePostDetail } from '@/store/post'

import { configs } from '../../configs'

export const PostContentView = defineComponent({
  name: 'post-view',
  setup() {
    const route = useRoute()

    const category = route.params.category as any
    const slug = route.params.slug as any

    const postDetail = usePostDetail(category, slug)

    const { dataRef, postPromise } = postDetail
    const titler = useTitle()
    postPromise.then((p) => {
      titler(p.title)
    })

    return () => {
      const data = dataRef.value
      return (
        <>
          {data ? (
            <ArticleRender
              {...data}
              rawLink={`${configs.previewHost}/posts/${category}/${slug}`}
            />
          ) : (
            <div>loading...</div>
          )}
        </>
      )
    }
  },
})

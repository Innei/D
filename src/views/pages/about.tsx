import { defineComponent } from 'vue'

import { useTitle } from '@/composable/use-title'
import { ArticleRender } from '@/modules/render/article'
import { usePageDetail } from '@/store/page'

export const AboutPage = defineComponent({
  name: 'about-page',
  setup() {
    const { dataRef, pagePromise } = usePageDetail('about')

    const titler = useTitle()
    pagePromise.then((page) => {
      titler(page.title)
    })
    return () => {
      if (!dataRef.value) {
        return <div>Loading..</div>
      }
      return (
        <ArticleRender
          text={dataRef.value.text}
          rawLink={'/about'}
          title={dataRef.value.title}
        ></ArticleRender>
      )
    }
  },
})

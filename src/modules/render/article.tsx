import { defineComponent } from 'vue'

import { Markdown } from '@/components/ui/markdown'

export const ArticleRender = defineComponent({
  name: 'article-render',
  props: {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rawLink: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { title, rawLink, text } = props
      return (
        <>
          <div class={'prose !max-w-max'}>
            <h1>{title}</h1>
            <hr class={'my-4'} />
            <Markdown>{text}</Markdown>
          </div>

          <p class={'mt-12 text-right text-sm'}>
            去原文地址获得更好阅读体验： <a href={rawLink}>{rawLink}</a>
          </p>
        </>
      )
    }
  },
})

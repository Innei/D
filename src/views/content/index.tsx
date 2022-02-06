import { NoteModel } from '@mx-space/api-client'
import BaseLayout from 'layouts/base.vue'
import { client } from 'utils/client'
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { configs } from '../../configs'

customElements.define(
  'markdown-render',
  class MarkdownRender extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() {
      return ['props']
    }

    render() {
      const shadowRoot = this.shadowRoot!

      shadowRoot.innerHTML = ''

      const props = this.getAttribute('props')
      if (!props) {
        return
      }
      const propsObj = JSON.parse(props)
      const { style, body, script, link, extraScripts } = propsObj

      const $styles: HTMLElement[] = style.map((text: string) => {
        const $style = document.createElement('style')
        $style.innerHTML = text || ''
        return $style
      })

      const $scripts: HTMLElement[] = script.map((text: string) => {
        const $script = document.createElement('script')
        $script.innerHTML = text || ''
        return $script
      })

      const $links: HTMLElement[] = link.map((text: string) => {
        const $link = document.createElement('link')
        $link.setAttribute('rel', 'stylesheet')
        $link.setAttribute('href', text || '')
        return $link
      })

      const $extraScripts: HTMLElement[] = extraScripts.map((text: string) => {
        const $script = document.createElement('script')

        $script.setAttribute('src', text || '')
        return $script
      })

      const $body = document.createElement('div')
      $body.innerHTML = body[0] || ''

      shadowRoot.append(
        ...$styles,
        ...$scripts,
        ...$links,
        $body,
        ...$extraScripts,
      )
    }
    attributeChangedCallback() {
      this.render()
    }
  },
)
export const NoteContentView = defineComponent({
  name: 'note-view',
  setup() {
    const route = useRoute()

    const nid = parseInt(route.params.id as any)

    const data = reactive({
      note: {} as NoteModel,
    })
    onUnmounted(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })

    const loading = ref(false)
    const renderProps = ref<any>()
    onMounted(async () => {
      loading.value = true
      try {
        data.note = (await client.note.getNoteById(nid)).data
        document.title = data.note.title + ' | ' + configs.title
        const json = await client.proxy.markdown.render
          .structure(data.note.id)
          .get<any>({ params: { theme: 'github' } })

        renderProps.value = json
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    })

    return () => (
      <BaseLayout>
        {data.note.id && loading.value ? (
          <div id="html" class="content-wrapper">
            Loading...
          </div>
        ) : (
          <markdown-render
            props={renderProps.value ? JSON.stringify(renderProps.value) : ''}
          />
        )}
      </BaseLayout>
    )
  },
})

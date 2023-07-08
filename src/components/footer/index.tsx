import { defineComponent } from 'vue'
import { configs } from '../../configs'

export const Footer = defineComponent({
  setup() {
    return () => {
      const y = new Date().getFullYear()
      return (
        <footer
          class={
            'text-text-gray font-serif text-xs pb-6 block text-center space-y-3'
          }
        >
          <p>
            Copyright © {y} <a href={configs.website}>Innei</a>. Powered by Vue
            3.
          </p>
          {configs.footer.info.map((i) => (
            <p key={i} innerHTML={i}></p>
          ))}
        </footer>
      )
    }
  },
})

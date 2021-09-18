import { defineComponent } from 'vue'
import { configs } from '../../../configs'

export const Footer = defineComponent({
  setup() {
    return () => {
      const y = new Date().getFullYear()
      return (
        <a href={configs.website}>
          <footer
            class={'text-text-gray font-serif text-xs pb-6 block text-center'}
          >
            Copyright © {y} Innei. Powered by Vue 3.
          </footer>
        </a>
      )
    }
  },
})

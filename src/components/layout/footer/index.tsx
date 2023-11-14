import { defineComponent } from 'vue'

import { configs } from '../../../configs'

export const Footer = defineComponent({
  setup() {
    return () => {
      const y = new Date().getFullYear()
      return (
        <footer
          class={
            'block space-y-3 pb-6 text-center text-xs opacity-60 text-slate-800 dark:text-slate-300'
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

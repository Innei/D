import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { configs } from '../../../configs'
import './index.css'
export const Header = defineComponent({
  setup() {
    return () => (
      <header class={'header-wrapper'}>
        <RouterLink to={'/'}>
          <h1>
            {configs.title}
            <small>{configs.subtitle}</small>
          </h1>
        </RouterLink>

        <div class={'links'}>
          <RouterLink to={'/about'}>About</RouterLink>
          <a href={configs.website} target={'_blank'}>
            Website
          </a>
        </div>
      </header>
    )
  },
})

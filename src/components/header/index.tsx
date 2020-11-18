import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { configs } from '../../../configs'
import styles from './index.module.css'
export const Header = defineComponent({
  setup() {
    return () => (
      <header class={styles['wrapper']}>
        <h1>
          {configs.title}
          <small>{configs.subtitle}</small>
        </h1>

        <div class={styles['links']}>
          <RouterLink to={'/about'}>About</RouterLink>
          <a href={configs.website} target={'_blank'}>
            Website
          </a>
        </div>
      </header>
    )
  },
})

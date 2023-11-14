import { defineComponent } from 'vue'

import { Footer } from '../components/layout/footer'
import { Header } from '../components/layout/header'

export const BaseLayout = defineComponent({
  setup(props, { slots }) {
    return () => (
      <div class="max-w-850px m-auto">
        <Header />

        <main class="my-3rem min-h-[calc(100vh-16rem)]">
          {slots.default?.()}
        </main>

        <Footer />
      </div>
    )
  },
})

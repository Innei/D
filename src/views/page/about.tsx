import { defineComponent } from 'vue'

export const AboutView = defineComponent({
  setup() {
    return () => {
      return (
        <article>
          <h1>This Site</h1>

          <p>Written by Vue 3,</p>
          <p>GraphQL supported.</p>
        </article>
      )
    }
  },
})

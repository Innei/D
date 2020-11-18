import { defineComponent } from 'vue'

export const Footer = defineComponent({
  setup() {
    return () => {
      const y = new Date().getFullYear()
      return (
        <footer class={'text-text-gray font-serif text-xs pb-6'}>
          Copyright © {y} Innei. Powered by Vue 3.
        </footer>
      )
    }
  },
})

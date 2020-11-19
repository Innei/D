import { configs } from '../configs'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {
    document.title = `${configs.title} | ${configs.subtitle}`

    return () => <RouterView></RouterView>
  },
})

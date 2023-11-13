<template>
  <div class="wrap">
    <Header></Header>

    <main>
      <slot />
    </main>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Footer } from '../components/layout/footer'
import { Header } from '../components/layout/header'

export default defineComponent({
  components: {
    Header: Header,
    Footer,
  },
})
</script>

<style>
.wrap {
  max-width: 850px;

  margin: auto;
}

main {
  margin: 3rem 0;
  min-height: calc(100vh - 16rem);
}
</style>

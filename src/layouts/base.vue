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
import { Header } from '../components/header'
import { Footer } from '../components/footer'
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
}
</style>

<template>
  <div class="wrap">
    <Header></Header>

    <main>
      <slot />
    </main>
    <footer></footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Header } from '../components/header'
export default defineComponent({
  components: {
    Header: Header,
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
  padding: 1rem;
}
</style>

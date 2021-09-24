<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="['note']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, onActivated } from '@vue/runtime-core'
import { configs } from '../configs'

export default defineComponent({
  setup() {
    onActivated(() => {
      document.title = `${configs.title} | ${configs.subtitle}`
    })
  },
})
</script>

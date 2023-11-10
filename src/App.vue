<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="['note-view']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
import { onActivated } from 'vue'

import { configs } from './configs'
import { useSyncStore } from './store'

useSyncStore().buildCollection()
onActivated(() => {
  document.title = `${configs.title} | ${configs.subtitle}`
})
</script>

<!--
 * @Author: Innei
 * @Date: 2021-03-14 14:13:28
 * @LastEditTime: 2021-03-14 14:38:38
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/App.vue
 * Mark: Coding with Love
-->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="['note']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { configs } from '../configs'
export default defineComponent({
  setup() {
    document.title = `${configs.title} | ${configs.subtitle}`
  },
})
</script>

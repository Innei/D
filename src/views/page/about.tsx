/*
 * @Author: Innei
 * @Date: 2020-11-18 22:02:20
 * @LastEditTime: 2021-03-14 11:24:06
 * @LastEditors: Innei
 * @FilePath: /nai-vue/src/views/page/about.tsx
 * Mark: Coding with Love
 */
import { BaseLayout } from 'layouts'
import { defineComponent } from 'vue'
import './index.css'

export const AboutView = defineComponent({
  setup() {
    return () => {
      return (
        <BaseLayout>
          <article class={'page-wrapper'}>
            <h1>This Site.</h1>

            <p>Powered by Vue 3 &amp; Vite</p>
            <p>GraphQL supported.</p>

            <h1>And me..</h1>

            <p>Third-year undergrad</p>
            <p>Wenzhou University of Technology</p>
            <p>TypeScript, NodeJS</p>
            <p>NestJS, NextJS, NuxtJS, React, Vue</p>
            <p>
              <a
                href="http://github.com/innei"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="http://innei.ren/feed"
                target="_blank"
                rel="noopener noreferrer"
              >
                RSS
              </a>
            </p>

            <blockquote class="mt-12">
              <p>幻なんかじゃない</p>
              <p>人生は夢じゃない</p>
              <p>僕達ははっきりと生きてるんだ</p>
              <p>夕焼け空は赤い 炎のように赤い </p>
              <p>この星の半分を真っ赤に染めた</p>
              <p>それよりももっと赤い血が</p>
              <p>体中を流れてるんだぜ</p>
            </blockquote>
          </article>
        </BaseLayout>
      )
    }
  },
})

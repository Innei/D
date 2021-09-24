import { BaseLayout } from 'layouts'
import { defineComponent } from 'vue'
import './index.css'

export const AboutView = defineComponent({
  setup() {
    return () => {
      return (
        <BaseLayout>
          <article class={'page-wrapper'}>
            <h1>This Site</h1>

            <p>Powered by Vue 3 &amp;</p>
            <p>Build with Vite</p>
            <p>Use the GraphQL</p>

            <h1>And me</h1>

            <p>Undergraduate 2022</p>
            <p>Wenzhou University of Technology(aka. 温州理工学院)</p>
            <p>TypeScript, NodeJS</p>
            <p>NestJS, NextJS, NuxtJS, React, Vue, and more.</p>
            <p>Coding with love, to make something possible.</p>
            <p>
              <a href="http://innei.ren" target="_blank">
                Home Page
              </a>
              <a href="http://github.com/innei" target="_blank">
                GitHub
              </a>
              <a href="http://innei.ren/feed" target="_blank">
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

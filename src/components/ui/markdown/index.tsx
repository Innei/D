import MarkdownVue from 'markdown-to-jsx-vue3'
import { defineComponent } from 'vue'

import './index.css'

import { AlertsRule } from './parsers/alert'
import { ContainerRule } from './parsers/container'
import { MarkRule } from './parsers/mark'
import { MentionRule } from './parsers/mention'
import { SpoilerRule } from './parsers/spoiler'

export const Markdown = defineComponent({
  // props: {},
  setup(props, { slots }) {
    return () => (
      <MarkdownVue
        options={{
          additionalParserRules: {
            spoilder: SpoilerRule,
            mention: MentionRule,

            mark: MarkRule,

            container: ContainerRule,
            alerts: AlertsRule,
          },
        }}
      >
        {slots.default?.()}
      </MarkdownVue>
    )
  },
})

import { Priority, simpleInlineRegex } from 'markdown-to-jsx-vue3'
import type { Rule } from 'markdown-to-jsx-vue3'

import { RichLink } from '../../rich-link/RichLink'

// [Innei]{GH@Innei} {TW@Innei} {TG@Innei}
export const MentionRule: Rule = {
  match: simpleInlineRegex(
    /^(\[(?<displayName>.*?)\])?\{((?<prefix>(GH)|(TW)|(TG))@(?<name>\w+\b))\}\s?(?!\[.*?\])/,
  ),
  order: Priority.MIN,
  parse(capture) {
    const { groups } = capture

    if (!groups) {
      return {}
    }
    return {
      content: { ...groups },
      type: 'mention',
    }
  },
  react(result, _, state) {
    const { content } = result
    if (!content) {
      return null as any
    }

    const { prefix, name, displayName } = content
    if (!name) {
      return null as any
    }

    return (
      <RichLink name={displayName || name} source={prefix} key={state?.key} />
    )
  },
}

import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx-vue3'
import type { Rule } from 'markdown-to-jsx-vue3'

// ||Spoiler||
export const SpoilerRule: Rule = {
  match: simpleInlineRegex(
    /^\|\|((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\|\|/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <del key={state?.key} class="spoiler" title="你知道的太多了">
        {output(node.content, state!)}
      </del>
    )
  },
}

import {
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx-vue3'
import type { Rule } from 'markdown-to-jsx-vue3'

//  ==Mark==
export const MarkRule: Rule = {
  match: simpleInlineRegex(/^==((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)==/),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    return (
      <mark
        key={state?.key}
        class="rounded-md bg-yellow-400 bg-opacity-80 px-1 text-black"
      >
        <span>{output(node.content, state!)}</span>
      </mark>
    )
  },
}

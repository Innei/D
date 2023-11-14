import { blockRegex, Priority } from 'markdown-to-jsx-vue3'
import type { Rule } from 'markdown-to-jsx-vue3'

import { Markdown } from '../'
import { pickImagesFromMarkdown } from '../utils/image'

const shouldCatchContainerName = [
  'gallery',
  'banner',
  'carousel',

  'warn',
  'error',
  'danger',
  'info',
  'success',
  'warning',
  'note',
].join('|')

export const ContainerRule: Rule = {
  match: blockRegex(
    new RegExp(
      `^\\s*::: *(?<name>(${shouldCatchContainerName})) *({(?<params>(.*?))})? *\n(?<content>[\\s\\S]+?)\\s*::: *(?:\n *)+\n?`,
    ),
  ),
  order: Priority.MED,
  parse(capture) {
    const { groups } = capture
    return {
      ...groups,
    }
  },
  // @ts-ignore
  react(node, _, state) {
    const { name, content, params } = node

    switch (name) {
      case 'carousel':
      case 'gallery': {
        return pickImagesFromMarkdown(content).map((image) => (
          <img
            src={image.url}
            alt={image.name}
            title={image.footnote}
            class="w-full"
          />
        ))
      }
      case 'warn':
      case 'error':
      case 'danger':
      case 'info':
      case 'note':
      case 'success':
      case 'warning': {
        return (
          <blockquote key={state?.key}>
            <Markdown class="w-full [&>p:first-child]:mt-0">{content}</Markdown>
          </blockquote>
        )
      }
      case 'banner': {
        if (!params) {
          break
        }

        return (
          <blockquote key={state?.key}>
            <Markdown class="w-full [&>p:first-child]:mt-0">{content}</Markdown>
          </blockquote>
        )
      }
    }

    return (
      <div key={state?.key}>
        <p>{content}</p>
      </div>
    )
  },
}

/**
 * gallery container
 *
 * ::: gallery
 * ![name](url)
 * ![name](url)
 * ![name](url)
 * :::
 */

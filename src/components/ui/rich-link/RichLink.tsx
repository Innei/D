import type { VNode } from 'vue'

const prefixToUrlMap = {
  GH: 'https://github.com/',
  TW: 'https://twitter.com/',
  TG: 'https://t.me/',
  ZH: 'https://www.zhihu.com/people/',
  WI: 'https://zh.wikipedia.org/wiki/',
}

export const RichLink = ({
  name,
  source,
  href,
}: {
  source: string
  name: VNode
  href?: string
}) => {
  // @ts-ignore
  const urlPrefix = prefixToUrlMap[source]

  if (!urlPrefix) return null

  return (
    <span class="mx-1 inline-flex items-center space-x-1">
      <a
        target="_blank"
        rel="noreferrer nofollow"
        href={href ?? `${urlPrefix}${name}`}
        class="underline-offset-2"
      >
        {name}
      </a>
    </span>
  )
}

RichLink.props = ['name', 'source', 'href']

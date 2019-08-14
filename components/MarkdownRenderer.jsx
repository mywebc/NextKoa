import { memo, useMemo } from 'react'

import MarkdownIt from 'markdown-it'

import 'github-markdown-css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
})
// atob转化中文有乱码问题
function b64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)))
}

const MarkdownRenderer = memo(function MdRender({ content, isBase64 }) {
  // console.log(readme)

  const markdown = isBase64 ? b64_to_utf8(content) : content

  const html = useMemo(() => md.render(markdown), [markdown])

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})

export default MarkdownRenderer

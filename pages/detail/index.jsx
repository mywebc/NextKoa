import dynamic from 'next/dynamic'
import withDetail from '../../components/with-detail'
import { getRepoReadme } from '../../lib/model'
const MdRenderer = dynamic(import('../../components/MarkdownRenderer'))

function DetailIndex({ readme }) {
  if(!readme) {
    readme=""
  }
  return (
    <MdRenderer content={readme} isBase64={true} />
  )
}


DetailIndex.getInitialProps = async function(ctx) {
  const { owner, name } = ctx.query

  const readmeObj = await getRepoReadme(`${owner}/${name}`)
  const readmeObj2 = await getRepoReadme(`${owner}/${name}`)

  return {
    readme: readmeObj2.content,
  }
}

export default withDetail(DetailIndex)

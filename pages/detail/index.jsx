import dynamic from 'next/dynamic'

import withDetail from '../../components/with-detail'

import { getRepoReadme } from '../../lib/model'
import api from '../../lib/api'
// const md = new MarkdownIt()

// import MdRenderer from '../../components/md-renderer'

const MdRenderer = dynamic(import('../../components/MarkdownRenderer'))
const API_BASE = process.env.API_BASE + '/github'

function DetailIndex({ readme }) {
  // console.log(readme)

  return (
    // <div>
    //   <div dangerouslySetInnerHTML={{ __html: readme }} />
    // </div>
    <MdRenderer content={readme} isBase64={true} />
  )
}

DetailIndex.getInitialProps = async function(ctx) {
  const { owner, name } = ctx.query
  debugger
  const readmeObj = await getRepoReadme(`${owner}/${name}`)
  console.log("返回的数据", readmeObj)
  return {
    readme: readmeObj.content,
  }
}
// DetailIndex.getInitialProps = async (ctx) => {
//   console.log("ctx", ctx)
//   const { owner, name } = ctx.query
//   const readmeResp = await api.request(
//     {
//       url: `/repos/${owner}/${name}/readme`,
//     },
//     ctx.req,
//     ctx.res,
//   )

//   return {
//     readme: readmeResp.data,
//   }
// }

export default withDetail(DetailIndex)

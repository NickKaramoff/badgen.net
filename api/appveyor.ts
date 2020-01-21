import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'AppVeyor',
  examples: {
    '/appveyor/ci/gruntjs/grunt': 'build',
    '/appveyor/ci/gruntjs/grunt/deprecate': 'build (branch)'
  },
  handlers: {
    '/appveyor/ci/:account/:project/:branch?': handler
  }
})

async function handler ({ account, project, branch }: PathArgs) {
  branch = branch ? `/branch/${branch}` : ''
  const endpoint = `https://ci.appveyor.com/api/projects/${account}/${project}${branch}`
  const { build } = await ky(endpoint).then(res => res.json())

  return {
    subject: 'appveyor',
    status: build.status,
    color: build.status === 'success' ? 'green' : 'red'
  }
}

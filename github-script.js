const fs = require('fs');
const execa = require('execa');

// This module runs in GitHub Action `github-script`
// see https://github.com/actions/github-script#run-a-separate-file-with-an-async-function
module.exports = async ({ github, context }) => {
  const { payload } = context;

  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;

  // console.log('github', JSON.stringify(github, null, 2));
  console.log('content', JSON.stringify(context, null, 2));

  return;

  try {
    const mainRef = await github.git
      .getRef({
        owner,
        repo,
        ref: `heads/${payload.repository.default_branch}`,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    if (!mainRef) {
      console.error('no main branch');
    }

    const prBranchName = 'testbranch222222222222222';

    let prRef = await github.git
      .getRef({
        owner,
        repo,
        ref: `heads/${prBranchName}`,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    console.log(prRef);

    if (!prRef) {
      await github.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${prBranchName}`,
        sha: mainRef.object.sha,
      });
    }

    await github.repos.createOrUpdateFileContents({
      owner,
      repo,
      sha: await getSHA({
        ref: prBranchName,
        path: 'testss/reverse.js',
      }),
      branch: prBranchName,
      path: 'testss/reverse.js',
      message: 'test new branch',
      content: fs.readFileSync('reverse.js', { encoding: 'base64' }),
    });

    const out = await execa('pre-commit', ['run', '--all-files']);
    console.log(out);

    // Create a PR to merge the licence ref into master
    await github.pulls
      .create({
        owner,
        repo,
        base: payload.repository.default_branch,
        head: prBranchName,
        title: 'test title',
        body: 'test body',
        maintainer_can_modify: true,
      })
      // Let's just ignore the error in case of duplicating pr
      .catch(() => null);
  } catch (e) {
    console.log(e);
  }

  async function getSHA({ ref, path }) {
    const data = await github.repos
      .getContent({
        owner,
        repo,
        ref,
        path,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    return data && data.sha;
  }
};

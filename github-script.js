const fs = require('fs');
const generateClients = require('./generate-clients');

// This module runs in GitHub Action `github-script`
// see https://github.com/actions/github-script#run-a-separate-file-with-an-async-function
module.exports = async ({ github, context }) => {
  const { payload } = context;
  const { inputs, repository } = payload;

  const owner = repository.owner.login;
  const repo = repository.name;

  const { projectName, identityProviders, validRedirectUrls, environments } = inputs;

  console.log(projectName, identityProviders, validRedirectUrls, environments);

  const newFiles = generateClients({
    projectName,
    identityProviders: JSON.parse(identityProviders),
    validRedirectUrls: JSON.parse(validRedirectUrls),
    environments: JSON.parse(environments),
  });
  console.log(newFiles);
  // console.log('github', JSON.stringify(github, null, 2));
  console.log('content', JSON.stringify(context, null, 2));

  try {
    const mainRef = await github.git
      .getRef({
        owner,
        repo,
        ref: `heads/${repository.default_branch}`,
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

    for (let x = 0; x < newFiles.length; x++) {
      await github.repos.createOrUpdateFileContents({
        owner,
        repo,
        sha: await getSHA({
          ref: prBranchName,
          path: newFiles[x],
        }),
        branch: prBranchName,
        path: newFiles[x],
        message: 'test new branch',
        content: fs.readFileSync(newFiles[x], { encoding: 'base64' }),
      });
    }

    // Create a PR to merge the licence ref into master
    await github.pulls
      .create({
        owner,
        repo,
        base: repository.default_branch,
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

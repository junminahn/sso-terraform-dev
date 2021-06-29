const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const realms = [
  { realm: 'onestopauth', idp: _.sortBy(['idir', 'github']) },
  { realm: 'onestopauth-basic', idp: _.sortBy(['idir', 'github', 'bceid-basic']) },
  { realm: 'onestopauth-both', idp: _.sortBy(['idir', 'github', 'bceid-basic', 'bceid-business']) },
  { realm: 'onestopauth-business', idp: _.sortBy(['idir', 'github', 'bceid-business']) },
];

module.exports = ({ projectName, identityProviders, validRedirectUrls, environments }) => {
  projectName = _.kebabCase(projectName);

  const targetRealm = realms.find((realm) => _.isEqual(realm.idp, _.sortBy(identityProviders)));

  const tfg = new TerraformGenerator();

  if (!targetRealm) return [];

  // Configure provider
  tfg.module(`client_${projectName}`, {
    source: '../../../modules/openid-client',
    realm_id: 'data.keycloak_realm.this.id',
    client_name: projectName,
    valid_redirect_uris: validRedirectUrls,
  });

  const SEPARATOR = '\n';

  return _.map(environments, (env) => {
    const outputDir = path.join(`terraform/keycloak-${env}/realms/${targetRealm.realm}`);
    const tfFile = `client-${projectName}.tf`;
    const target = path.join(outputDir, tfFile);

    const result = tfg.generate();
    const formatted =
      result.tf
        .split(SEPARATOR)
        .filter((v) => v.length > 0)
        .join(SEPARATOR) + SEPARATOR;

    shell.mkdir('-p', outputDir);
    fs.writeFileSync(target, formatted);

    child_process.execSync('terraform fmt', { cwd: outputDir });

    return target;
  });
};

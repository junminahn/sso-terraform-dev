const _ = require('lodash');
const KcAdminClient = require('keycloak-admin').default;

const DEV_KEYCLOAK_URL = process.env.DEV_KEYCLOAK_URL || '';
const TEST_KEYCLOAK_URL = process.env.TEST_KEYCLOAK_URL || '';
const PROD_KEYCLOAK_URL = process.env.PROD_KEYCLOAK_URL || '';
const KEYCLOAK_USERNAME = process.env.KEYCLOAK_USERNAME || 'admin';
const KEYCLOAK_PASSWORD = process.env.KEYCLOAK_PASSWORD || 'Pa55w0rd';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';

const KEYCLOAK_URLS = [DEV_KEYCLOAK_URL, TEST_KEYCLOAK_URL, PROD_KEYCLOAK_URL];

const targetRealms = ['onestopauth', 'onestopauth-business', 'onestopauth-basic', 'onestopauth-both'];

const kcAdminClient = new KcAdminClient({ baseUrl: `${KEYCLOAK_URL}/auth` });

async function main() {
  try {
    KEYCLOAK_URLS.forEach(async (url) => {
      await kcAdminClient.auth({
        grantType: 'password',
        clientId: KEYCLOAK_CLIENT_ID,
        username: KEYCLOAK_USERNAME,
        password: KEYCLOAK_PASSWORD,
      });

      const createRealm = (realm) => kcAdminClient.realms.create({ realm, enabled: true });

      const realms = await kcAdminClient.realms.find();

      // Create missing required realms
      const realmsToCreate = _.difference(targetRealms, _.map(realms, 'realm'));

      console.log(`Realms to create in ${url}: `, realmsToCreate);

      const payload = await Promise.all(realmsToCreate.map(createRealm));

      console.log(payload);
    });
  } catch (err) {
    console.error(err);
  }
}

main();

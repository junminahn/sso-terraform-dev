module "client_testclient" {
  source = "../../../modules/openid-client"

  realm_id            = data.keycloak_realm.this.id
  client_name         = "testclient"
  valid_redirect_uris = ["*"]

}

module "client_negajjang-project" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "negajjang-project"
  valid_redirect_uris = [
    "*"
  ]
}

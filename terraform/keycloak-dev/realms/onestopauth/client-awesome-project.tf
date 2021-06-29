module "client_awesome-project" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "awesome-project"
  valid_redirect_uris = [
    "*"
  ]
}

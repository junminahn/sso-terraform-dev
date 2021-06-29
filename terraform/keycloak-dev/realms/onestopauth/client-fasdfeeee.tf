module "client_fasdfeeee" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "fasdfeeee"
  valid_redirect_uris = [
    "*"
  ]
}

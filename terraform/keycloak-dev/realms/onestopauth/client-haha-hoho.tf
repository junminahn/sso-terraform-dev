module "client_haha-hoho" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "haha-hoho"
  valid_redirect_uris = [
    "*"
  ]
}

module "client_kaka-hoho" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "kaka-hoho"
  valid_redirect_uris = [
    "*"
  ]
}

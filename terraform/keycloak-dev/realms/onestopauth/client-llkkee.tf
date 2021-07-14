module "client_llkkee" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "llkkee"
  valid_redirect_uris = [
    "*"
  ]
}

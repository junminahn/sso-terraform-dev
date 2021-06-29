module "client_client-filess" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "client-filess"
  valid_redirect_uris = [
    "*"
  ]
}

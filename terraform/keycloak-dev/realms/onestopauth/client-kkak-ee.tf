module "client_kkak-ee" {
  source      = "../../../modules/openid-client"
  realm_id    = "data.keycloak_realm.this.id"
  client_name = "kkak-ee"
  valid_redirect_uris = [
    "*"
  ]
}

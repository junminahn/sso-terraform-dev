module "client_jasdkfjk-ekeee" {
  source      = "../../../modules/openid-client"
  realm_id    = data.keycloak_realm.this.id
  client_name = "jasdkfjk-ekeee"
  valid_redirect_uris = [
    "*"
  ]
}

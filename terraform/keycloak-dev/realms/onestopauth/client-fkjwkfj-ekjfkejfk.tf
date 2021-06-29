module "client_fkjwkfj-ekjfkejfk" {
  source      = "../../../modules/openid-client"
  realm_id    = data.keycloak_realm.this.id
  client_name = "fkjwkfj-ekjfkejfk"
  valid_redirect_uris = [
    "*"
  ]
}

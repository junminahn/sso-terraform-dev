module "client_s" {
  source   = "../../../modules/openid-client"
  realm_id = data.keycloak_realm.this.id
}

import usersController from './users'
import domainsController from './domains'
import whitelistController from './whitelistrecords'

export const API = {
  users: usersController,
  domains: domainsController,
  whitelist: whitelistController,
}

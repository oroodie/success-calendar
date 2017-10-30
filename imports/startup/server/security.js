import { Meteor } from 'meteor/meteor'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'
import { _ } from 'meteor/underscore'

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
    update() { return true },
})

// Source: https://github.com/meteor/todos/blob/react-testing/imports/startup/server/security.js
// Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell
// meteor shell – command depends on meteor running already in another terminal
const AUTH_METHODS = [
    'login',
    'logout',
    'logoutOtherClients',
    'getNewToken',
    'removeOtherTokens',
    'configureLoginService',
    '__dynamicImport',
]

if (Meteor.isServer) {
    // Only allow 2 login attempts per connection per 5 seconds
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(AUTH_METHODS, name)
        },
        // Rate limit per connection ID
        connectionId() { return true },
    }, 2, 5000)
}

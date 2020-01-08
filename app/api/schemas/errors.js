/**
 * GraphQL errors.
 * Can be extended to return JSON in the future, but
 * currently only simple strings are used.
 */
const notAuthenticated = 'User is not authenticated.';

const notAuthorized = 'User is not authorized.';

module.exports = {
    notAuthenticated,
    notAuthorized
}

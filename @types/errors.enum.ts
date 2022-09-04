export enum Errors {
  USER_NOT_FOUND = 'errors.user-not-found',
  USER_NOT_ACTIVE = 'errors.user-not-active',
  USER_EXISTS = 'errors.user-exists',
  USER_SESSION_NOT_FOUND = 'errors.user-session-not-found',
  USER_SESSION_EXPIRED = 'errors.user-session-expired',

  TOKEN_NOT_FOUND = 'errors.token-not-found',

  DATA_NOT_CREATED = 'errors.data-not-created',
  DATA_NOT_UPDATED = 'errors.data-not-updated',
  DATA_NOT_DELETED = 'errors.data-not-deleted',
  DATA_NOT_FOUND = 'errors.data-not-found',
  DATA_EXISTS = 'errors.data-exists',

  INCORRECT_PASSWORD = 'errors.incorrect-password',
  CODE_NOT_MATCHED = 'errors.code-not-matched',
  FORBIDDEN = 'errors.forbidden',
}

import { createError } from 'apollo-errors';
 
export const AuthenticationError = createError('AuthenticationError', {
    message: 'Invalid credentials'
});
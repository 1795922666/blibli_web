import { createFlatRequest } from '../request'
export const authRequest = createFlatRequest({
  baseURL: '/api',
  timeout: 3000,
  showMessage: false
})
export * from './fileController'
export * from './userController'
export * from './videoController'

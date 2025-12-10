import { authRequest } from '../index'
import type { FlatResponseData } from '@renderer/server/type'
export const upload = (fromData: FormData): Promise<FlatResponseData> => {
  return authRequest({
    url: '/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    showMessage: false,
    method: 'post',
    data: fromData
  })
}
export const merge = (value): Promise<FlatResponseData> => {
  return authRequest({
    url: '/file/merge',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    showMessage: false,
    method: 'post',
    data: value
  })
}
export const cancelFile = (hash: string): Promise<FlatResponseData> => {
  return authRequest({
    url: '/file/cancel',
    method: 'DELETE',
    params: {
      hash
    }
  })
}
export const gethash = (hash: string): Promise<FlatResponseData> => {
  return authRequest({
    url: '/file/gethash',
    method: 'get',
    params: {
      hash
    }
  })
}
export const dleteFile = (id: string): Promise<FlatResponseData> => {
  return authRequest({
    url: '/file/dlete',
    method: 'DELETE',
    params: {
      id
    }
  })
}

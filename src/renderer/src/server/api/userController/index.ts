import { authRequest } from '../index'
import type { LoginData, registerData, result, userInfo } from '../types/auth'
import type { FlatResponseData } from '@renderer/server/type'
export const login = (user: LoginData): Promise<FlatResponseData> => {
  return authRequest({
    url: '/user/login',
    method: 'post',
    data: user
  })
}
export const logout = (): Promise<FlatResponseData> => {
  return authRequest({
    url: '/user/logout',
    method: 'get'
  })
}

export const register = (user: registerData): Promise<FlatResponseData> => {
  return authRequest({
    url: '/user/register',
    method: 'put',
    data: user
  })
}

export const getUserInfo = (): Promise<FlatResponseData<result<userInfo>>> => {
  return authRequest({
    url: '/user/userInfo',
    method: 'get'
  })
}
export const token = (): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: '/user/token',
    method: 'get'
  })
}

export const getUserSpace = (id: string): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: `/user/${id}/userspace`,
    method: 'get'
  })
}
export const follow = (id: string, bol: boolean): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: `/user/follow/${id}/${bol}`,
    method: 'post'
  })
}
export const followlist = (id: string): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: `/user/${id}/followlist`,
    method: 'get'
  })
}

export const historyOlder = (
  contactId: string,
  lastTime: number
): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: `/user/history/increment`,
    method: 'get',
    params: {
      contactId,
      lastTime
    }
  })
}

export const getContribution = (userId: string): Promise<FlatResponseData<result<void>>> => {
  return authRequest({
    url: `/video/contribution/${userId}`,
    method: 'get'
  })
}

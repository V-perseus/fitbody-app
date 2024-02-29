import * as Sentry from '@sentry/react-native'
import deviceInfoModule from 'react-native-device-info'
import { Platform } from 'react-native'

// Services
import { setErrorMessage } from '../error'
import { displayLoadingModal, hideLoadingModal } from '../loading'
import NavigationService from '../NavigationService'
import globals from '../../config/globals'
import { updateUserIsRestricted } from '../../data/user'
import { storeRegistry } from '../../store/storeRegistry'

const API_BASE = globals.apiBase

type Methods = 'get' | 'post' | 'patch' | 'put' | 'delete'
type MethodsUppercase = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
interface IDefaultHeaders {
  [key: string]: string
}
interface IParams {
  method: MethodsUppercase
  headers: IDefaultHeaders
  body?: FormData | string
}
export interface IAppErrorResponse {
  response: {
    data: {
      message: string
    }
  }
}
export function isAppErrorResponse(error: any): error is IAppErrorResponse {
  return error.response?.data?.message !== undefined
}

export const apiPublic = <T>(url: string, method: Methods = 'get', data: {} | null = {}, loader = true, headers = {}): Promise<T> => {
  // console.log('api',`${API_BASE}${url}`);
  if (loader) {
    displayLoadingModal()
  }

  let token = storeRegistry.getState().services.session.apiToken
  let defaultHeaders: IDefaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-App-Version': deviceInfoModule.getVersion(),
    'X-App-Os': Platform.OS,
  }
  if (token) {
    defaultHeaders.Authorization = 'Bearer ' + token
  }

  let reqHeaders = {}
  Object.assign(reqHeaders, defaultHeaders)
  let params: IParams = {
    method: method.toUpperCase() as MethodsUppercase,
    headers: reqHeaders,
  }

  if ((method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH') && data) {
    if (data instanceof FormData) {
      params.body = data
    } else {
      params.body = JSON.stringify(data)
    }
  }

  let req = new Request(API_BASE + url, params)

  return fetch(req)
    .then((response) => {
      if (response.ok) {
        if (loader) {
          hideLoadingModal()
        }
        let responseText = response.text()
        return responseText
          .then(function (text) {
            return text ? Promise.resolve(JSON.parse(text)) : Promise.resolve({})
          })
          .catch(function (error) {
            return Promise.reject(error)
          })
      }
      if (loader) {
        hideLoadingModal()
      }
      return Promise.reject(response)
    })
    .catch((error: Response) => {
      let message: string | Error = ''
      if (error && error instanceof Error) {
        try {
          Sentry.captureException(new Error(error.message || JSON.stringify(error)))
        } catch {}
        message = error
      } else if (error && error.json) {
        error.json().then((errorJson) => {
          message = errorJson.message
          if (message && typeof message === 'string' && message.toLowerCase().includes('please purchase')) {
            updateUserIsRestricted(true)
            NavigationService.sendToPaywall()
          } else if (!url.includes('/v4/events')) {
            setErrorMessage({ error: message })
          }
        })
      }
      hideLoadingModal()
      return Promise.reject(message)
    })
}

/**
 * Sign a user in
 */
export const apiAuth = <T>(url: string, method: Methods = 'get', data: null | {} = {}, loader = true, headers = {}): Promise<T> => {
  return apiPublic<T>(url, method, data, loader, headers)
}

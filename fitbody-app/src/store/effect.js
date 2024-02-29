/* global fetch */
import RNFS from 'react-native-fs'

import globals from '../config/globals'
import { storeRegistry } from './storeRegistry'

const API_BASE = globals.apiBase

export function NetworkError(response, status) {
  this.name = 'NetworkError'
  this.status = status
  this.response = response
}

NetworkError.prototype = Error.prototype

const tryParseJSON = (json) => {
  if (!json) {
    return null
  }
  try {
    return JSON.parse(json)
  } catch (e) {
    throw new Error(`Failed to parse unexpected JSON response: ${json}`)
  }
}

const getResponseBody = (res) => {
  const contentType = res.headers.get('content-type') || false
  if (contentType && contentType.indexOf('json') >= 0) {
    return res.text().then(tryParseJSON)
  }
  return res.text()
}

export const getHeaders = (headers) => {
  let { 'Content-Type': contentTypeCapitalized, 'content-type': contentTypeLowerCase, ...restOfHeaders } = headers || {}

  const token = storeRegistry.getState().services.session.apiToken
  if (token) {
    restOfHeaders = { ...restOfHeaders, Authorization: `Bearer ${token}` }
  }

  const contentType = contentTypeCapitalized || contentTypeLowerCase || 'application/json'
  return { ...restOfHeaders, 'content-type': contentType }
}

// eslint-disable-next-line no-unused-vars
export default async (effect, _action) => {
  // console.log(_action.type)
  const { url, json, ...options } = effect

  if (_action.type === 'SAVE_PROGRESS_PHOTOS') {
    // console.log('yes!')

    json.photos = await Promise.all(
      json.photos.map(async (p) => {
        const r = await RNFS.readFile(p.image, 'base64')
        return {
          ...p,
          image: `data:image/jpeg;base64,${r}`,
        }
      }),
    )

    // console.log('json.photos', json.photos)
  }

  const headers = getHeaders(options.headers)

  if (json !== null && json !== undefined) {
    try {
      options.body = JSON.stringify(json)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  return fetch(`${API_BASE}${url}`, { ...options, headers }).then((res) => {
    if (res.ok) {
      return getResponseBody(res)
    }
    return getResponseBody(res).then((body) => {
      throw new NetworkError(body || '', res.status)
    })
  })
}

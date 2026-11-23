import { request } from './client'
import type { LensOption } from '../types'

export function getLenses() {
  return request<LensOption[]>('/lenses')
}

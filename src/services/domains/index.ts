import http from '../api'
import type { APIResponse, APIResponseStatus } from '@/services/types.ts'
import type { AddDomainParam, DomainListResponse } from './types'

async function getDomains(search: string) {
  if (search.length > 0) {
    return await http.get<APIResponse<DomainListResponse>>(`/api/domains?search=${search}`, {
      withCredentials: true,
    })
  } else {
    return await http.get<APIResponse<DomainListResponse>>(`/api/domains`, {
      withCredentials: true,
    })
  }
}

async function addDomain(params: AddDomainParam) {
  return await http.post<APIResponseStatus>(`/api/domains`, params, {
    withCredentials: true,
  })
}

async function deleteDomain(dname: string) {
  return await http.delete(`/api/domains/${dname}`, {
    withCredentials: true,
  })
}

export default {
  getDomains,
  addDomain,
  deleteDomain
}

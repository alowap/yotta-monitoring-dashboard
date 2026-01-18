import http from '../api'
import type { APIResponse, APIResponseStatus } from '@/services/types.ts'
import type { AddWhitelistRecordParam, WhitelistRecord } from './types'

async function getWhitelistRecords() {
  return await http.get<APIResponse<WhitelistRecord[]>>(`/api/domains`, {
    withCredentials: true,
  })
}

async function addWhitelistRecord(params: AddWhitelistRecordParam) {
  return await http.post<APIResponseStatus>(`/api/whitelist`, params, {
    withCredentials: true,
  })
}

async function deleteWhitelistRecord(rip: string) {
  return await http.delete(`/api/domains/${rip}`, {
    withCredentials: true,
  })
}

export default {
  getWhitelistRecords,
  addWhitelistRecord,
  deleteWhitelistRecord,
}

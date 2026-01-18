import { usePersonalStore } from "@/stores/users";
import http from "../api";
import type { APIResponseStatus } from '@/services/types.ts'

async function validate() {
  return await http.get<APIResponseStatus>('/api/sessions/validate', {
    withCredentials: true,
  })
}

export default {
  validate,
};
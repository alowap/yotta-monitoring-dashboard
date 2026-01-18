import http from "../api";
import type { APIResponse, APIResponseStatus } from '@/services/types.ts'
import type { InputUserLogin, User } from '@/services/users/types.ts'

async function loginUser(input: InputUserLogin) {
  return await http.post<APIResponseStatus>('/api/login', input, {
    withCredentials: true,
  })
}

async function logoutUser() {
  return await http.get<APIResponseStatus>('/api/logout', {
    withCredentials: true,
  })
}

async function getUsers() {
  return await http.get<APIResponse<User[]>>('/api/users', {
    withCredentials: true,
  })
}

async function addUser(user: User) {
  return await http.post<APIResponseStatus>('/api/users', user, {
    withCredentials: true,
  })
}

async function deleteUser(uname: string) {
  return await http.delete<APIResponseStatus>(`/api/users/${uname}`, {
    withCredentials: true,
  })
}

async function getPersonalInfo() {
  return await http.get<APIResponse<User>>('/api/users/me', {
    withCredentials: true,
  })
}

export default {
  loginUser,
  logoutUser,
  getUsers,
  addUser,
  deleteUser,
  getPersonalInfo
};
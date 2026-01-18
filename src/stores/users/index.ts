import users from '@/services/users'
import type { User } from '@/services/users/types'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    isLoading: false,
    error: null as unknown | null,
  }),
  actions: {
    async fetchUsers() {
      this.isLoading = true
      this.error = null
      try {
        const response = await users.getUsers()
        this.users = response.data.data
        return response.data.data
      } catch (e) {
        this.error = e
        this.users = []
        throw e
      } finally {
        this.isLoading = false
      }
    },
  }
})

export const usePersonalStore = defineStore('personal', {
  state: () => ({
    personalInfo: null as User | null,
    isLoading: false,
    error: null as unknown | null,
  }),
  actions: {
    async fetchPersonalInfo() {
      this.isLoading = true
      this.error = null
      try {
        const response = await users.getPersonalInfo()
        this.personalInfo = response.data.data
        return response.data.data
      } catch (e) {
        this.error = e
        this.personalInfo = null
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})
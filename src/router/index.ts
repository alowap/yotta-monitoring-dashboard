import sessions from '@/services/sessions'
import { usePersonalStore } from '@/stores/users'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardMapView from '@/views/DashboardMapView.vue'
import UsersView from '@/views/UsersView.vue'

async function validateSession() {
  const sessionResponse = await sessions.validate()
  const personalStore = usePersonalStore()

  try {
    await personalStore.fetchPersonalInfo()

    if (sessionResponse.data.status == 2) {
      return '/auth/login'
    }

    return true
  } catch (error) {
    return { path: '/auth/login' }
  }
}

async function alreadyLogged() {
  const sessionResponse = await sessions.validate()

  if (sessionResponse.data.status == 1) {
    return '/dashboard'
  }
}

function validateSessionAndPermission(perm: number) {
  return async (to: any, from: any, next: any) => {
    const sessionResponse = await sessions.validate()
    const personalStore = usePersonalStore()

    try {
      await personalStore.fetchPersonalInfo()
      if (sessionResponse.data.status == 2) {
        next({ path: '/auth/login' })
      } else if (sessionResponse.data.status == 1 && personalStore.personalInfo?.uperm !== perm) {
        next({ path: '/dashboard' })
      } else {
        next()
      }

      return true
    } catch (error) {
      return { path: '/auth/login' }
    }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login',
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      beforeEnter: [alreadyLogged],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardMapView,
      beforeEnter: [validateSession],
      children: [
        {
          path: 'users',
          name: 'Users',
          component: UsersView,
          beforeEnter: [validateSessionAndPermission(3)],
        },
      ],
    },
  ],
})

export default router

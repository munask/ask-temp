"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'
import { ROLE_PERMISSIONS } from '@/types/permissions'
import type { Role, Permission, Resource } from '@/types/permissions'

import type { User } from './authTypes'

// Resources that all authenticated users can read by default
const ALL_READ_RESOURCES: Resource[] = [
  'dashboard',
  'profile',
  'settings',
  'data',
  'data-report',
  'showcase',
]

function normalizeUser(raw: User): User {
  if ((!raw.roles || raw.roles.length === 0) && raw.role) {
    const rolePermissions = ROLE_PERMISSIONS[raw.role] ?? (
      ALL_READ_RESOURCES.map((resource) => ({ resource, action: 'read' as const }))
    )
    const roles: Role[] = [
      {
        id: raw.role,
        name: raw.role,
        permissions: rolePermissions,
      },
    ]
    return {
      ...raw,
      roles,
      permissions: raw.permissions ?? [],
    }
  }

  if ((!raw.role || raw.role === '') && raw.roles && raw.roles.length > 0) {
    return {
      ...raw,
      role: raw.roles[0].id,
    }
  }

  return {
    ...raw,
    roles: raw.roles ?? [],
    permissions: raw.permissions ?? [],
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  _hasHydrated: boolean
}

interface AuthActions {
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setHasHydrated: (state: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setAuth: (rawUser: User, token: string) => {
        const user = normalizeUser(rawUser)
        import('@/lib/tokenManager').then(({ tokenManager }) => {
          tokenManager.setToken(token)
          if (user.role) tokenManager.setUserRole(user.role)
        })
        set({ user, isAuthenticated: true, isLoading: false, _hasHydrated: true })
      },

      clearAuth: () => {
        import('@/lib/tokenManager').then(({ tokenManager }) => {
          tokenManager.removeToken()
        })
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const store = state as any
          if (store.user && typeof store.set === 'function') {
            const user = normalizeUser(store.user)
            store.set({ _hasHydrated: true, user })
          }
        }
      },
    }
  )
)

// Hook to wait for hydration before consuming the store
export function useAuthStoreHydrated() {
  const hasHydrated = useAuthStore((s) => s._hasHydrated)
  const [, setReady] = useState(false)

  useEffect(() => {
    if (hasHydrated) {
      setReady(true)
    }
  }, [hasHydrated])

  return hasHydrated
}

export type { Role, Permission }
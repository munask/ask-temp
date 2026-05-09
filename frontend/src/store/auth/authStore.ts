"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { tokenManager } from "@/lib/tokenManager"
import { ROLE_PERMISSIONS } from "@/types/permissions"
import type { Role, Permission, Resource } from "@/types/permissions"

import type { User } from './authTypes';

// Resources that all authenticated users can read by default
const ALL_READ_RESOURCES: Resource[] = [
  "dashboard",
  "profile",
  "settings",
  "data",
  "data-report",
  "showcase",
]

function normalizeUser(raw: User): User {
  if ((!raw.roles || raw.roles.length === 0) && raw.role) {
    const rolePermissions = ROLE_PERMISSIONS[raw.role] ?? (
      ALL_READ_RESOURCES.map((resource) => ({ resource, action: "read" as const }))
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

  if ((!raw.role || raw.role === "") && raw.roles && raw.roles.length > 0) {
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
  checkAuth: () => boolean
  setHasHydrated: (state: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setAuth: (rawUser: User, token: string) => {
        const user = normalizeUser(rawUser)
        tokenManager.setToken(token)

        if (user.role) {
          tokenManager.setUserRole(user.role)
        }

        set({
          user,
          isAuthenticated: true,
          isLoading: false
        })
      },

      clearAuth: () => {
        tokenManager.removeToken()

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      checkAuth: () => {
        const hasToken = tokenManager.hasToken()
        const { user } = get()
        const isAuth = hasToken && !!user

        if (isAuth !== get().isAuthenticated) {
          set({ isAuthenticated: isAuth })
        }

        return isAuth
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state })
      }
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth store:", error)
            return
          }
          if (state) {
            const updates: Partial<AuthState> = { _hasHydrated: true }
            if (state.user) {
              updates.user = normalizeUser(state.user)
            }
            useAuthStore.setState(updates)
          }
        }
      }
    }
  )
)

export type { Role, Permission }

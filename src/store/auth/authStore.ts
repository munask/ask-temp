"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { tokenManager } from "@/lib/tokenManager"
import { ROLE_PERMISSIONS } from "@/types/permissions"
import type { Role, Permission, Resource } from "@/types/permissions"

import type { User } from './authTypes';

// Resources that all authenticated users can read by default
// (used for backward compat when the backend returns unmapped roles)
const ALL_READ_RESOURCES: Resource[] = [
  "dashboard",
  "profile",
  "settings",
  "data",
  "data-report",
  "showcase",
]

// ─── Normalize User Data ─────────────────────────────────────────────────
// The backend may return:
//   - Old format: { role: "admin" }  (no roles/permissions arrays)
//   - New format: { roles: [...], permissions: [...] }  (may lack role string)
// This normalizes both into a consistent shape.

function normalizeUser(raw: User): User {
  // If roles array is missing but role string exists, build roles from it
  if ((!raw.roles || raw.roles.length === 0) && raw.role) {
    // If the role is known in ROLE_PERMISSIONS, use its permissions.
    // Otherwise, grant read access to all non-admin resources (backward compat
    // for domain-specific roles that aren't mapped in ROLE_PERMISSIONS).
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

  // If role string is missing but roles array exists, derive role from first role
  if ((!raw.role || raw.role === "") && raw.roles && raw.roles.length > 0) {
    return {
      ...raw,
      role: raw.roles[0].id,
    }
  }

  // Ensure defaults
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
}

interface AuthActions {
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  checkAuth: () => boolean
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
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
          // Re-normalize user data after rehydration from localStorage.
          // Direct mutation doesn't trigger re-render, so we use
          // the store's set() via getState() to force an update.
          if (state?.user) {
            const normalized = normalizeUser(state.user)
            // Only update if something changed (to avoid infinite loop)
            const needsUpdate =
              normalized.roles !== state.user.roles ||
              normalized.permissions !== state.user.permissions
            if (needsUpdate) {
              state.user = normalized
            }
          }
        }
      }
    }
  )
)

export type { Role, Permission }

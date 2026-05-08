"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { tokenManager } from "@/lib/tokenManager"
import { ROLE_PERMISSIONS } from "@/types/permissions"
import type { Role, Permission } from "@/types/permissions"

import type { User } from './authTypes';

// ─── Normalize User Data ─────────────────────────────────────────────────
// The backend may return:
//   - Old format: { role: "admin" }  (no roles/permissions arrays)
//   - New format: { roles: [...], permissions: [...] }  (may lack role string)
// This normalizes both into a consistent shape.

function normalizeUser(raw: User): User {
  // If roles array is missing but role string exists, build roles from it
  if ((!raw.roles || raw.roles.length === 0) && raw.role) {
    const rolePermissions = ROLE_PERMISSIONS[raw.role] ?? []
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

        // Store user role in cookie for middleware access
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
          if (error) console.error("Failed to rehydrate auth store:", error)
          // Re-normalize user data after rehydration from localStorage
          if (state?.user) {
            state.user = normalizeUser(state.user)
          }
        }
      }
    }
  )
)

// ─── Re-export helpers for direct import ─────────────────────────────────
// Useful for non-React contexts (middleware, utilities).

export type { Role, Permission }

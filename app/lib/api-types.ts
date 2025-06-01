import type { NextRequest } from "next/server"

// Common types for API routes
export interface ApiRouteParams<T = Record<string, string>> {
  params: T
}

// Specific route parameter types
export interface UserRouteParams {
  params: {
    userId: string
  }
}

// Common API response types
export interface ApiResponse<T = any> {
  success?: boolean
  error?: string
  message?: string
  data?: T
  details?: string
}

// Request handler types
export type ApiRouteHandler<T = any> = (request: NextRequest, context: ApiRouteParams<T>) => Promise<Response>

export type UserApiRouteHandler = (request: NextRequest, context: UserRouteParams) => Promise<Response>

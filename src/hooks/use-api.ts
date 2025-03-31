import { useCallback } from 'react'
import {
  useQuery,
  useMutation,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'
import apiClient from '@/lib/api'
import { ApiResponse } from '@/types/api'

/**
 * Hook genérico para fazer uma requisição GET com React Query
 */
export function useApiQuery<TData, TError = AxiosError>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError, TData>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<ApiResponse<TData>, TError, TData>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TData>>(url, config)
      return response.data
    },
    select: (data) => data.data,
    ...options,
  })
}

/**
 * Hook genérico para fazer uma requisição POST com React Query
 */
export function useApiMutation<TRequest, TResponse, TError = AxiosError>(
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseMutationOptions<ApiResponse<TResponse>, TError, TRequest>,
    'mutationFn'
  >,
) {
  const mutationFn = useCallback(
    async (data: TRequest) => {
      const response = await apiClient.post<ApiResponse<TResponse>>(
        url,
        data,
        config,
      )
      return response.data
    },
    [url, config],
  )

  return useMutation<ApiResponse<TResponse>, TError, TRequest>({
    mutationFn,
    ...options,
  })
}

/**
 * Hook genérico para fazer uma requisição PUT com React Query
 */
export function useApiPut<TRequest, TResponse, TError = AxiosError>(
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseMutationOptions<ApiResponse<TResponse>, TError, TRequest>,
    'mutationFn'
  >,
) {
  const mutationFn = useCallback(
    async (data: TRequest) => {
      const response = await apiClient.put<ApiResponse<TResponse>>(
        url,
        data,
        config,
      )
      return response.data
    },
    [url, config],
  )

  return useMutation<ApiResponse<TResponse>, TError, TRequest>({
    mutationFn,
    ...options,
  })
}

/**
 * Hook genérico para fazer uma requisição DELETE com React Query
 */
export function useApiDelete<TResponse, TError = AxiosError>(
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseMutationOptions<ApiResponse<TResponse>, TError, string | number>,
    'mutationFn'
  >,
) {
  const mutationFn = useCallback(
    async (id: string | number) => {
      const response = await apiClient.delete<ApiResponse<TResponse>>(
        `${url}/${id}`,
        config,
      )
      return response.data
    },
    [url, config],
  )

  return useMutation<ApiResponse<TResponse>, TError, string | number>({
    mutationFn,
    ...options,
  })
}

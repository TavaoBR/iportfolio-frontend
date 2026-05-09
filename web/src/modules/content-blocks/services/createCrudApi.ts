import { http } from '@/services/api/http'
import { unwrapData } from '@/types/api-envelope'

export function createCrudApi<TPayload, TEntity>(basePath: string) {
  return {
    async list(): Promise<TEntity[]> {
      const { data } = await http.get<unknown>(basePath)
      const list = unwrapData<TEntity[]>(data)
      return Array.isArray(list) ? list : []
    },

    async create(payload: TPayload): Promise<TEntity> {
      const { data } = await http.post<unknown>(basePath, payload)
      return unwrapData<TEntity>(data)
    },

    async update(id: number, payload: Partial<TPayload>): Promise<TEntity> {
      const { data } = await http.patch<unknown>(`${basePath}/${id}`, payload)
      return unwrapData<TEntity>(data)
    },

    async remove(id: number): Promise<void> {
      await http.delete(`${basePath}/${id}`)
    },
  }
}


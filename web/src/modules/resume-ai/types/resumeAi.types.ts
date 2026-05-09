export type EmptyAiPayload = Record<string, never>

export interface AiCompareJobPayload {
  job_description: string
}

export interface AiAnalysis {
  id: number
  analysis_type: string
  status: string
  request_payload?: Record<string, unknown> | null
  result?: Record<string, unknown> | null
  error_message?: string | null
  created_at: string
  updated_at?: string | null
}


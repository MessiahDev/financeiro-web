export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  correlationId?: string
}

export interface Notification {
  key: string
  message: string
}

export interface AuditFields {
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}
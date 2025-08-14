
// Tipos base para entidades do banco de dados
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Interfaces para sincronização com banco
export interface DatabaseSync {
  lastSync: Date;
  pendingChanges: string[];
  isOnline: boolean;
}

// Status de sincronização para entidades
export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export interface SyncableEntity extends BaseEntity {
  sync_status?: SyncStatus;
  last_synced_at?: Date;
  version?: number;
}

// Filtros genéricos para queries
export interface QueryFilters {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
}

// Resposta padrão de API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Configuração de paginação
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

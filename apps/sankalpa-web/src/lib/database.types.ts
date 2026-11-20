// Local migration contract. Replace with generated types after hosted verification.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
type Owned = { id: string; owner_id: string; created_at: string; updated_at: string }
export type EntityRow = Owned & { title: string; body: string; kind: string; project_id: string | null; completed_at: string | null; estimate_minutes: number | null }
export type LifeRow = Owned & { title: string; body: string; status: 'active' | 'paused' | 'complete'; project_id?: string | null; goal_id?: string | null; kind?: 'quest' | 'goal' }
export type FocusRow = Owned & { entity_id: string; started_at: string; ended_at: string | null; elapsed_seconds: number; outcome: string | null }
export type CaptureReceiptResult = { entity_id: string; replayed: boolean; deleted: boolean }
type Table<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] }
export type Database = { public: {
  Tables: {
    profiles: Table<Owned & { timezone: string }>
    entities: Table<EntityRow>
    goals: Table<LifeRow>
    projects: Table<LifeRow>
    missions: Table<LifeRow>
    daily_plans: Table<Owned & { plan_date: string; sankalp: string; capacity_minutes: number }>
    daily_priorities: Table<Owned & { plan_id: string; entity_id: string; position: number }>
    focus_sessions: Table<FocusRow>
  }
  Views: Record<never, never>
  Functions: {
    capture_entity_once: { Args: { p_request_id: string; p_title: string; p_kind: string; p_plan_date?: string }; Returns: CaptureReceiptResult }
    mutate_entity: { Args: { p_entity_id: string; p_fields: Json; p_schedule: Json }; Returns: EntityRow }
    start_focus: { Args: { p_entity_id: string }; Returns: FocusRow }
    finish_focus: { Args: { p_session_id: string; p_elapsed_seconds: number }; Returns: FocusRow }
    export_account: { Args: Record<never, never>; Returns: Json }
  }
  Enums: Record<never, never>
  CompositeTypes: Record<never, never>
} }

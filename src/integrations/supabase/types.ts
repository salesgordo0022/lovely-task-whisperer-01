export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      productivity_stats: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          focus_time: number | null
          id: string
          productivity_score: number | null
          streak: number | null
          tasks_completed: number | null
          total_tasks: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          focus_time?: number | null
          id?: string
          productivity_score?: number | null
          streak?: number | null
          tasks_completed?: number | null
          total_tasks?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          focus_time?: number | null
          id?: string
          productivity_score?: number | null
          streak?: number | null
          tasks_completed?: number | null
          total_tasks?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      task_checklist_items: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          order_index: number | null
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_checklist_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subcategories: {
        Row: {
          category: string
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_time: number | null
          attendees: string[] | null
          category: string
          completed: boolean | null
          completed_at: string | null
          course: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_time: number | null
          id: string
          institution: string | null
          is_important: boolean | null
          is_urgent: boolean | null
          location: string | null
          meeting_notes: string | null
          meeting_url: string | null
          priority: string
          professor: string | null
          reminder_minutes: number | null
          semester: string | null
          start_date: string | null
          subcategory_id: string | null
          subject: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_time?: number | null
          attendees?: string[] | null
          category: string
          completed?: boolean | null
          completed_at?: string | null
          course?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_time?: number | null
          id?: string
          institution?: string | null
          is_important?: boolean | null
          is_urgent?: boolean | null
          location?: string | null
          meeting_notes?: string | null
          meeting_url?: string | null
          priority: string
          professor?: string | null
          reminder_minutes?: number | null
          semester?: string | null
          start_date?: string | null
          subcategory_id?: string | null
          subject?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_time?: number | null
          attendees?: string[] | null
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          course?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_time?: number | null
          id?: string
          institution?: string | null
          is_important?: boolean | null
          is_urgent?: boolean | null
          location?: string | null
          meeting_notes?: string | null
          meeting_url?: string | null
          priority?: string
          professor?: string | null
          reminder_minutes?: number | null
          semester?: string | null
          start_date?: string | null
          subcategory_id?: string | null
          subject?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "task_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_settings: {
        Row: {
          created_at: string
          email_enabled: boolean
          id: string
          last_sent_at: string | null
          send_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          last_sent_at?: string | null
          send_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          last_sent_at?: string | null
          send_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_game_stats: {
        Row: {
          achievements: Json | null
          created_at: string | null
          experience: number | null
          id: string
          level: number | null
          points: number | null
          streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          points?: number | null
          streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          experience?: number | null
          id?: string
          level?: number | null
          points?: number | null
          streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string | null
          completed: boolean
          created_at: string
          current: number
          description: string
          end_date: string
          id: string
          priority: string | null
          rewards: Json
          start_date: string
          target: number
          title: string
          type: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          created_at?: string
          current?: number
          description: string
          end_date: string
          id: string
          priority?: string | null
          rewards?: Json
          start_date: string
          target: number
          title: string
          type: string
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          created_at?: string
          current?: number
          description?: string
          end_date?: string
          id?: string
          priority?: string | null
          rewards?: Json
          start_date?: string
          target?: number
          title?: string
          type?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

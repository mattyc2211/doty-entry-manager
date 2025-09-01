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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      dog_entries: {
        Row: {
          breed: string
          created_at: string
          dogs_nz_registration: string
          id: string
          pedigree_name: string
          photo_url: string | null
          submission_id: string
        }
        Insert: {
          breed: string
          created_at?: string
          dogs_nz_registration: string
          id?: string
          pedigree_name: string
          photo_url?: string | null
          submission_id: string
        }
        Update: {
          breed?: string
          created_at?: string
          dogs_nz_registration?: string
          id?: string
          pedigree_name?: string
          photo_url?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_entries_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_entries: {
        Row: {
          created_at: string
          dog_entry_id: string
          event_type: string
          id: string
          qualifying_date: string
          qualifying_show: string
        }
        Insert: {
          created_at?: string
          dog_entry_id: string
          event_type: string
          id?: string
          qualifying_date: string
          qualifying_show: string
        }
        Update: {
          created_at?: string
          dog_entry_id?: string
          event_type?: string
          id?: string
          qualifying_date?: string
          qualifying_show?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_entries_dog_entry_id_fkey"
            columns: ["dog_entry_id"]
            isOneToOne: false
            referencedRelation: "dog_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      form_abandonment: {
        Row: {
          abandoned_step: string
          entry_type: string | null
          id: string
          last_active_field: string | null
          session_id: string
          time_before_abandonment_seconds: number | null
          timestamp: string
        }
        Insert: {
          abandoned_step: string
          entry_type?: string | null
          id?: string
          last_active_field?: string | null
          session_id: string
          time_before_abandonment_seconds?: number | null
          timestamp?: string
        }
        Update: {
          abandoned_step?: string
          entry_type?: string | null
          id?: string
          last_active_field?: string | null
          session_id?: string
          time_before_abandonment_seconds?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      form_analytics: {
        Row: {
          action: string
          entry_type: string | null
          error_field: string | null
          error_message: string | null
          form_step: string
          id: string
          session_id: string
          step_duration_seconds: number | null
          timestamp: string
          total_form_duration_seconds: number | null
        }
        Insert: {
          action: string
          entry_type?: string | null
          error_field?: string | null
          error_message?: string | null
          form_step: string
          id?: string
          session_id: string
          step_duration_seconds?: number | null
          timestamp?: string
          total_form_duration_seconds?: number | null
        }
        Update: {
          action?: string
          entry_type?: string | null
          error_field?: string | null
          error_message?: string | null
          form_step?: string
          id?: string
          session_id?: string
          step_duration_seconds?: number | null
          timestamp?: string
          total_form_duration_seconds?: number | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          device_type: string | null
          duration_seconds: number | null
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          dietary_requirements: string | null
          dinner_tickets: number | null
          exhibitor_email: string
          exhibitor_first_name: string
          exhibitor_phone: string
          exhibitor_surname: string
          extra_catalogues: number | null
          id: string
          submission_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dietary_requirements?: string | null
          dinner_tickets?: number | null
          exhibitor_email: string
          exhibitor_first_name: string
          exhibitor_phone: string
          exhibitor_surname: string
          extra_catalogues?: number | null
          id?: string
          submission_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dietary_requirements?: string | null
          dinner_tickets?: number | null
          exhibitor_email?: string
          exhibitor_first_name?: string
          exhibitor_phone?: string
          exhibitor_surname?: string
          extra_catalogues?: number | null
          id?: string
          submission_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          device_type: string | null
          ended_at: string | null
          form_abandoned_at_step: string | null
          form_completed: boolean | null
          id: string
          pages_visited: number | null
          screen_resolution: string | null
          session_id: string
          started_at: string
          submission_id: string | null
          total_duration_seconds: number | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          ended_at?: string | null
          form_abandoned_at_step?: string | null
          form_completed?: boolean | null
          id?: string
          pages_visited?: number | null
          screen_resolution?: string | null
          session_id: string
          started_at?: string
          submission_id?: string | null
          total_duration_seconds?: number | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          ended_at?: string | null
          form_abandoned_at_step?: string | null
          form_completed?: boolean | null
          id?: string
          pages_visited?: number | null
          screen_resolution?: string | null
          session_id?: string
          started_at?: string
          submission_id?: string | null
          total_duration_seconds?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analytics_summary: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_session_duration: number
          form_completion_rate: number
          most_abandoned_step: string
          peak_hour: number
          total_page_views: number
          total_sessions: number
        }[]
      }
      verify_admin_credentials: {
        Args: { password_input: string; username_input: string }
        Returns: boolean
      }
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

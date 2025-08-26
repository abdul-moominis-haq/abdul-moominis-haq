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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      contact_inquiries: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          project: string | null
          responded_at: string | null
          response_message: string | null
          status: string | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          project?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          project?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          admin_notes: string | null
          agenda: string | null
          approved_date: string | null
          company: string | null
          created_at: string
          duration: number | null
          email: string
          id: string
          meeting_link: string | null
          meeting_type: string
          message: string | null
          name: string
          proposed_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          agenda?: string | null
          approved_date?: string | null
          company?: string | null
          created_at?: string
          duration?: number | null
          email: string
          id?: string
          meeting_link?: string | null
          meeting_type: string
          message?: string | null
          name: string
          proposed_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          agenda?: string | null
          approved_date?: string | null
          company?: string | null
          created_at?: string
          duration?: number | null
          email?: string
          id?: string
          meeting_link?: string | null
          meeting_type?: string
          message?: string | null
          name?: string
          proposed_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          id: string
          recipient_email: string
          related_inquiry_id: string | null
          related_meeting_id: string | null
          sent_at: string
          subject: string
          type: string
        }
        Insert: {
          content: string
          id?: string
          recipient_email: string
          related_inquiry_id?: string | null
          related_meeting_id?: string | null
          sent_at?: string
          subject: string
          type: string
        }
        Update: {
          content?: string
          id?: string
          recipient_email?: string
          related_inquiry_id?: string | null
          related_meeting_id?: string | null
          sent_at?: string
          subject?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_inquiry_id_fkey"
            columns: ["related_inquiry_id"]
            isOneToOne: false
            referencedRelation: "contact_inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_meeting_id_fkey"
            columns: ["related_meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_profile_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "farmer" | "agronomist" | "admin" | "analyst"
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
    Enums: {
      user_role: ["farmer", "agronomist", "admin", "analyst"],
    },
  },
} as const

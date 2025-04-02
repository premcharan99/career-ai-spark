export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      job_data: {
        Row: {
          analysis_id: string | null
          created_at: string
          id: string
          preferred_skills: string[]
          required_skills: string[]
          requirements: string[]
          responsibilities: string[]
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          preferred_skills: string[]
          required_skills: string[]
          requirements: string[]
          responsibilities: string[]
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          preferred_skills?: string[]
          required_skills?: string[]
          requirements?: string[]
          responsibilities?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_data_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          analyses_used: number
          created_at: string
          email: string
          id: string
          max_analyses: number
          subscription_status: string
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          analyses_used?: number
          created_at?: string
          email: string
          id: string
          max_analyses?: number
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          analyses_used?: number
          created_at?: string
          email?: string
          id?: string
          max_analyses?: number
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      resume_analyses: {
        Row: {
          created_at: string
          id: string
          improved_content: string
          job_description: string
          job_title: string
          match_score: number
          matching_skills: string[]
          missing_skills: string[]
          resume_url: string | null
          suggestions: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          improved_content: string
          job_description: string
          job_title: string
          match_score: number
          matching_skills: string[]
          missing_skills: string[]
          resume_url?: string | null
          suggestions: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          improved_content?: string
          job_description?: string
          job_title?: string
          match_score?: number
          matching_skills?: string[]
          missing_skills?: string[]
          resume_url?: string | null
          suggestions?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_data: {
        Row: {
          analysis_id: string | null
          certifications: string[]
          created_at: string
          education: string[]
          experience: string[]
          id: string
          skills: string[]
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          certifications: string[]
          created_at?: string
          education: string[]
          experience: string[]
          id?: string
          skills: string[]
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          certifications?: string[]
          created_at?: string
          education?: string[]
          experience?: string[]
          id?: string
          skills?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_data_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

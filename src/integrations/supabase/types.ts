export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conte_pages: {
        Row: {
          audio_bambara_url: string | null
          audio_fr_url: string | null
          conte_id: string
          contenu: string
          created_at: string
          id: string
          image_url: string | null
          numero_page: number
          updated_at: string
        }
        Insert: {
          audio_bambara_url?: string | null
          audio_fr_url?: string | null
          conte_id: string
          contenu: string
          created_at?: string
          id?: string
          image_url?: string | null
          numero_page: number
          updated_at?: string
        }
        Update: {
          audio_bambara_url?: string | null
          audio_fr_url?: string | null
          conte_id?: string
          contenu?: string
          created_at?: string
          id?: string
          image_url?: string | null
          numero_page?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conte_pages_conte_id_fkey"
            columns: ["conte_id"]
            isOneToOne: false
            referencedRelation: "contes"
            referencedColumns: ["id"]
          },
        ]
      }
      contes: {
        Row: {
          actif: boolean
          audio_bambara_url: string | null
          audio_fr_url: string | null
          categorie: string
          created_at: string
          description: string
          duree_minutes: number
          id: string
          image_url: string | null
          is_premium: boolean
          langues: string[]
          morale: string | null
          ordre_affichage: number | null
          titre: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          audio_bambara_url?: string | null
          audio_fr_url?: string | null
          categorie: string
          created_at?: string
          description: string
          duree_minutes: number
          id?: string
          image_url?: string | null
          is_premium?: boolean
          langues?: string[]
          morale?: string | null
          ordre_affichage?: number | null
          titre: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          audio_bambara_url?: string | null
          audio_fr_url?: string | null
          categorie?: string
          created_at?: string
          description?: string
          duree_minutes?: number
          id?: string
          image_url?: string | null
          is_premium?: boolean
          langues?: string[]
          morale?: string | null
          ordre_affichage?: number | null
          titre?: string
          updated_at?: string
        }
        Relationships: []
      }
      devinettes: {
        Row: {
          actif: boolean
          categorie: string
          created_at: string
          difficulte: string
          id: string
          indice: string | null
          is_premium: boolean
          points: number
          question: string
          reponse: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          categorie: string
          created_at?: string
          difficulte: string
          id?: string
          indice?: string | null
          is_premium?: boolean
          points?: number
          question: string
          reponse: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          categorie?: string
          created_at?: string
          difficulte?: string
          id?: string
          indice?: string | null
          is_premium?: boolean
          points?: number
          question?: string
          reponse?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          conte_id: string | null
          created_at: string
          devinette_id: string | null
          id: string
          points_gagnes: number | null
          type_activite: string
          user_id: string
        }
        Insert: {
          conte_id?: string | null
          created_at?: string
          devinette_id?: string | null
          id?: string
          points_gagnes?: number | null
          type_activite: string
          user_id: string
        }
        Update: {
          conte_id?: string | null
          created_at?: string
          devinette_id?: string | null
          id?: string
          points_gagnes?: number | null
          type_activite?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_conte_id_fkey"
            columns: ["conte_id"]
            isOneToOne: false
            referencedRelation: "contes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activities_devinette_id_fkey"
            columns: ["devinette_id"]
            isOneToOne: false
            referencedRelation: "devinettes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_conte_progress: {
        Row: {
          conte_id: string
          created_at: string
          derniere_ecoute: string | null
          derniere_page: number
          favori: boolean
          id: string
          termine: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          conte_id: string
          created_at?: string
          derniere_ecoute?: string | null
          derniere_page?: number
          favori?: boolean
          id?: string
          termine?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          conte_id?: string
          created_at?: string
          derniere_ecoute?: string | null
          derniere_page?: number
          favori?: boolean
          id?: string
          termine?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_conte_progress_conte_id_fkey"
            columns: ["conte_id"]
            isOneToOne: false
            referencedRelation: "contes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          id: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
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
      subscription_type: "free" | "premium"
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
      subscription_type: ["free", "premium"],
    },
  },
} as const

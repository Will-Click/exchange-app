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
    PostgrestVersion: "17.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_ideas: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["event_category"]
          description: string
          id: string
          image: string | null
          links: Json
          season_note: string
          sort: number
          tags: string[]
          title: string
          university_id: string
        }
        Insert: {
          body?: string
          category: Database["public"]["Enums"]["event_category"]
          description: string
          id?: string
          image?: string | null
          links?: Json
          season_note: string
          sort?: number
          tags?: string[]
          title: string
          university_id: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["event_category"]
          description?: string
          id?: string
          image?: string | null
          links?: Json
          season_note?: string
          sort?: number
          tags?: string[]
          title?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_ideas_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          applies_to: Json
          badge: string | null
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["checklist_kind"]
          last_reviewed: string | null
          link_label: string | null
          link_url: string | null
          note: string | null
          slug: string
          sort: number
          source: string | null
          title: string
          university_id: string
          warning: string | null
        }
        Insert: {
          applies_to?: Json
          badge?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["checklist_kind"]
          last_reviewed?: string | null
          link_label?: string | null
          link_url?: string | null
          note?: string | null
          slug: string
          sort?: number
          source?: string | null
          title: string
          university_id: string
          warning?: string | null
        }
        Update: {
          applies_to?: Json
          badge?: string | null
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["checklist_kind"]
          last_reviewed?: string | null
          link_label?: string | null
          link_url?: string | null
          note?: string | null
          slug?: string
          sort?: number
          source?: string | null
          title?: string
          university_id?: string
          warning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_progress: {
        Row: {
          done_at: string
          item_id: string
          user_id: string
        }
        Insert: {
          done_at?: string
          item_id: string
          user_id: string
        }
        Update: {
          done_at?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_progress_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          booking_url: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at: string
          created_by: string | null
          description: string | null
          eligibility_note: string | null
          ends_at: string | null
          id: string
          is_demo: boolean
          is_free: boolean
          last_reviewed: string | null
          location: string | null
          organizer: string | null
          price_note: string | null
          source_url: string | null
          starts_at: string
          status: Database["public"]["Enums"]["event_status"]
          tags: string[]
          title: string
          transport_note: string | null
          university_id: string
          updated_at: string
        }
        Insert: {
          booking_url?: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          eligibility_note?: string | null
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          is_free?: boolean
          last_reviewed?: string | null
          location?: string | null
          organizer?: string | null
          price_note?: string | null
          source_url?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[]
          title: string
          transport_note?: string | null
          university_id: string
          updated_at?: string
        }
        Update: {
          booking_url?: string | null
          category?: Database["public"]["Enums"]["event_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          eligibility_note?: string | null
          ends_at?: string | null
          id?: string
          is_demo?: boolean
          is_free?: boolean
          last_reviewed?: string | null
          location?: string | null
          organizer?: string | null
          price_note?: string | null
          source_url?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[]
          title?: string
          transport_note?: string | null
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          body: string
          category: string
          icon: string
          id: string
          links: Json
          slug: string
          sort: number
          summary: string
          title: string
          tone: string
          university_id: string
        }
        Insert: {
          body?: string
          category?: string
          icon?: string
          id?: string
          links?: Json
          slug: string
          sort?: number
          summary: string
          title: string
          tone?: string
          university_id: string
        }
        Update: {
          body?: string
          category?: string
          icon?: string
          id?: string
          links?: Json
          slug?: string
          sort?: number
          summary?: string
          title?: string
          tone?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_offers: {
        Row: {
          code: string | null
          details: string | null
          expires_on: string | null
          id: string
          is_demo: boolean
          partner: string
          title: string
          university_id: string
        }
        Insert: {
          code?: string | null
          details?: string | null
          expires_on?: string | null
          id?: string
          is_demo?: boolean
          partner: string
          title: string
          university_id: string
        }
        Update: {
          code?: string | null
          details?: string | null
          expires_on?: string | null
          id?: string
          is_demo?: boolean
          partner?: string
          title?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_offers_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          event_id: string | null
          hidden_at: string | null
          id: string
          is_pinned: boolean
          term_id: string
        }
        Insert: {
          author_id?: string
          body: string
          created_at?: string
          event_id?: string | null
          hidden_at?: string | null
          id?: string
          is_pinned?: boolean
          term_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          event_id?: string | null
          hidden_at?: string | null
          id?: string
          is_pinned?: boolean
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "member_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_terms: {
        Row: {
          joined_at: string
          profile_id: string
          term_id: string
        }
        Insert: {
          joined_at?: string
          profile_id: string
          term_id: string
        }
        Update: {
          joined_at?: string
          profile_id?: string
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_terms_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "member_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_terms_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_terms_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_rules_at: string | null
          arrival_date: string | null
          arrival_unsure: boolean
          contact_email: string | null
          created_at: string
          custom_interests: string[]
          departure_note: string | null
          display_name: string
          first_name: string
          full_name: string
          has_arrived: boolean
          home_country: string | null
          home_university: string | null
          housing_status: Database["public"]["Enums"]["housing_status"] | null
          id: string
          interests: string[]
          last_name: string
          major: string | null
          onboarded_at: string | null
          onboarding_step: number
          participant_type: Database["public"]["Enums"]["participant_type"]
          phone: string | null
          show_contact_email: boolean
          show_home_university: boolean
          show_interests: boolean
          show_major: boolean
          show_phone: boolean
          show_social: boolean
          social_handle: string | null
          suspended_at: string | null
          university_id: string | null
          updated_at: string
        }
        Insert: {
          accepted_rules_at?: string | null
          arrival_date?: string | null
          arrival_unsure?: boolean
          contact_email?: string | null
          created_at?: string
          custom_interests?: string[]
          departure_note?: string | null
          display_name?: string
          first_name?: string
          full_name?: string
          has_arrived?: boolean
          home_country?: string | null
          home_university?: string | null
          housing_status?: Database["public"]["Enums"]["housing_status"] | null
          id: string
          interests?: string[]
          last_name?: string
          major?: string | null
          onboarded_at?: string | null
          onboarding_step?: number
          participant_type?: Database["public"]["Enums"]["participant_type"]
          phone?: string | null
          show_contact_email?: boolean
          show_home_university?: boolean
          show_interests?: boolean
          show_major?: boolean
          show_phone?: boolean
          show_social?: boolean
          social_handle?: string | null
          suspended_at?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          accepted_rules_at?: string | null
          arrival_date?: string | null
          arrival_unsure?: boolean
          contact_email?: string | null
          created_at?: string
          custom_interests?: string[]
          departure_note?: string | null
          display_name?: string
          first_name?: string
          full_name?: string
          has_arrived?: boolean
          home_country?: string | null
          home_university?: string | null
          housing_status?: Database["public"]["Enums"]["housing_status"] | null
          id?: string
          interests?: string[]
          last_name?: string
          major?: string | null
          onboarded_at?: string | null
          onboarding_step?: number
          participant_type?: Database["public"]["Enums"]["participant_type"]
          phone?: string | null
          show_contact_email?: boolean
          show_home_university?: boolean
          show_interests?: boolean
          show_major?: boolean
          show_phone?: boolean
          show_social?: boolean
          social_handle?: string | null
          suspended_at?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          hidden_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          author_id?: string
          body: string
          created_at?: string
          hidden_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          hidden_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "member_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reply_id: string | null
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reply_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reply_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          created_at: string
          ends_on: string
          id: string
          is_open: boolean
          name: string
          starts_on: string
          university_id: string
        }
        Insert: {
          created_at?: string
          ends_on: string
          id?: string
          is_open?: boolean
          name: string
          starts_on: string
          university_id: string
        }
        Update: {
          created_at?: string
          ends_on?: string
          id?: string
          is_open?: boolean
          name?: string
          starts_on?: string
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          region: string | null
          reviewed_countries: string[]
          short_name: string
          slug: string
          timezone: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          region?: string | null
          reviewed_countries?: string[]
          short_name: string
          slug: string
          timezone?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          region?: string | null
          reviewed_countries?: string[]
          short_name?: string
          slug?: string
          timezone?: string
        }
        Relationships: []
      }
    }
    Views: {
      member_profiles: {
        Row: {
          contact_email: string | null
          display_name: string | null
          home_university: string | null
          id: string | null
          interests: string[] | null
          major: string | null
          phone: string | null
          social_handle: string | null
          term_names: string[] | null
          university_id: string | null
        }
        Insert: {
          contact_email?: never
          display_name?: string | null
          home_university?: never
          id?: string | null
          interests?: never
          major?: never
          phone?: never
          social_handle?: never
          term_names?: never
          university_id?: string | null
        }
        Update: {
          contact_email?: never
          display_name?: string | null
          home_university?: never
          id?: string | null
          interests?: never
          major?: never
          phone?: never
          social_handle?: never
          term_names?: never
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: { uni: string }; Returns: boolean }
      is_any_admin: { Args: never; Returns: boolean }
      is_term_member: { Args: { t: string }; Returns: boolean }
      my_university: { Args: never; Returns: string }
      report_university: {
        Args: { post: string; reply: string }
        Returns: string
      }
    }
    Enums: {
      checklist_kind: "required" | "info"
      event_category: "university" | "city" | "rockies"
      event_status: "scheduled" | "canceled"
      housing_status: "on_campus" | "off_campus" | "looking" | "unsure"
      participant_type: "exchange" | "member"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      checklist_kind: ["required", "info"],
      event_category: ["university", "city", "rockies"],
      event_status: ["scheduled", "canceled"],
      housing_status: ["on_campus", "off_campus", "looking", "unsure"],
      participant_type: ["exchange", "member"],
    },
  },
} as const

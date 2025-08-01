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
      approvals: {
        Row: {
          approved_by: string
          comments: string | null
          created_at: string | null
          id: string
          request_id: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          approved_by: string
          comments?: string | null
          created_at?: string | null
          id?: string
          request_id: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          approved_by?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "stock_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          added_by: string | null
          category: string
          condition: string | null
          created_at: string
          current_value: number
          depreciation_rate: number | null
          description: string | null
          id: string
          last_valuation_date: string | null
          location: string | null
          name: string
          purchase_date: string
          purchase_order_number: string | null
          purchase_price: number
          quantity: number
          serial_number: string | null
          supplier: string | null
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          added_by?: string | null
          category: string
          condition?: string | null
          created_at?: string
          current_value: number
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          last_valuation_date?: string | null
          location?: string | null
          name: string
          purchase_date: string
          purchase_order_number?: string | null
          purchase_price: number
          quantity?: number
          serial_number?: string | null
          supplier?: string | null
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          added_by?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          current_value?: number
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          last_valuation_date?: string | null
          location?: string | null
          name?: string
          purchase_date?: string
          purchase_order_number?: string | null
          purchase_price?: number
          quantity?: number
          serial_number?: string | null
          supplier?: string | null
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      department_passwords: {
        Row: {
          created_at: string
          department_name: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_name: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_name?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          added_by: string | null
          created_at: string | null
          description: string | null
          id: string
          minimum_stock: number | null
          name: string
          quantity: number
          store_id: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          minimum_stock?: number | null
          name: string
          quantity?: number
          store_id: string
          unit?: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          minimum_stock?: number | null
          name?: string
          quantity?: number
          store_id?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          department: string | null
          file_name: string | null
          id: number
          is_read: boolean | null
          message: string
          uploader: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          file_name?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          uploader?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          file_name?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          uploader?: string | null
        }
        Relationships: []
      }
      procurements: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          procured_by: string
          procurement_date: string | null
          quantity: number
          request_id: string | null
          supplier: string | null
          total_cost: number | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          procured_by: string
          procurement_date?: string | null
          quantity: number
          request_id?: string | null
          supplier?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          procured_by?: string
          procurement_date?: string | null
          quantity?: number
          request_id?: string | null
          supplier?: string | null
          total_cost?: number | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurements_procured_by_fkey"
            columns: ["procured_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurements_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "stock_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          date: string | null
          file_url: string | null
          format: string
          generated_by: string | null
          id: string
          name: string
          size: string | null
          type: string
        }
        Insert: {
          date?: string | null
          file_url?: string | null
          format: string
          generated_by?: string | null
          id?: string
          name: string
          size?: string | null
          type: string
        }
        Update: {
          date?: string | null
          file_url?: string | null
          format?: string
          generated_by?: string | null
          id?: string
          name?: string
          size?: string | null
          type?: string
        }
        Relationships: []
      }
      stock_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          item_id: string
          quantity: number
          reason: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requested_by: string
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          quantity: number
          reason?: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requested_by: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          quantity?: number
          reason?: string | null
          request_type?: Database["public"]["Enums"]["request_type"]
          requested_by?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          store_type: Database["public"]["Enums"]["store_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          store_type: Database["public"]["Enums"]["store_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          store_type?: Database["public"]["Enums"]["store_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_manager_id_fkey"
            columns: ["manager_id"]
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
      calculate_asset_value: {
        Args: {
          purchase_price: number
          purchase_date: string
          depreciation_rate: number
          category: string
        }
        Returns: number
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      request_status: "pending" | "approved" | "rejected" | "completed"
      request_type: "add_stock" | "remove_stock" | "transfer_stock"
      store_type:
        | "library"
        | "laboratory"
        | "kitchen"
        | "sports"
        | "ict_lab"
        | "boarding"
        | "examination"
        | "agriculture"
        | "general"
      user_role:
        | "admin"
        | "storekeeper"
        | "teacher"
        | "procurement_officer"
        | "bursar"
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
      request_status: ["pending", "approved", "rejected", "completed"],
      request_type: ["add_stock", "remove_stock", "transfer_stock"],
      store_type: [
        "library",
        "laboratory",
        "kitchen",
        "sports",
        "ict_lab",
        "boarding",
        "examination",
        "agriculture",
        "general",
      ],
      user_role: [
        "admin",
        "storekeeper",
        "teacher",
        "procurement_officer",
        "bursar",
      ],
    },
  },
} as const

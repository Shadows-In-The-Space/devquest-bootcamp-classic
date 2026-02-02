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
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            game_scores: {
                Row: {
                    created_at: string
                    email: string
                    id: string
                    score: number
                }
                Insert: {
                    created_at?: string
                    email: string
                    id?: string
                    score: number
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: string
                    score?: number
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

/**
 * Types TypeScript pour le schéma Supabase de Parent Stream.
 * À régénérer avec `supabase gen types typescript --project-id <id> > src/types/database.ts`
 * après modification du schéma SQL.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_label: string;
          color: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          short_label: string;
          color?: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          short_label?: string;
          color?: string;
          sort_order?: number;
        };
      };
      series: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category_id: string | null;
          cover_url: string | null;
          banner_url: string | null;
          rating: number;
          season: number;
          is_new: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category_id?: string | null;
          cover_url?: string | null;
          banner_url?: string | null;
          rating?: number;
          season?: number;
          is_new?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category_id?: string | null;
          cover_url?: string | null;
          banner_url?: string | null;
          rating?: number;
          season?: number;
          is_new?: boolean;
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          series_id: string | null;
          title: string;
          subtitle: string | null;
          description: string | null;
          category_id: string | null;
          episode_number: number | null;
          duration_seconds: number;
          video_url: string | null;
          thumbnail_url: string | null;
          rating: number;
          satisfaction: number;
          views_count: number;
          published_at: string | null;
          uploader_id: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          series_id?: string | null;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          category_id?: string | null;
          episode_number?: number | null;
          duration_seconds?: number;
          video_url?: string | null;
          thumbnail_url?: string | null;
          rating?: number;
          satisfaction?: number;
          views_count?: number;
          published_at?: string | null;
          uploader_id?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          series_id?: string | null;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          category_id?: string | null;
          episode_number?: number | null;
          duration_seconds?: number;
          video_url?: string | null;
          thumbnail_url?: string | null;
          rating?: number;
          satisfaction?: number;
          views_count?: number;
          published_at?: string | null;
          uploader_id?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          video_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          video_id?: string;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          video_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          video_id?: string;
          created_at?: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          progress_seconds: number;
          completed: boolean;
          last_watched_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          progress_seconds?: number;
          completed?: boolean;
          last_watched_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_id?: string;
          progress_seconds?: number;
          completed?: boolean;
          last_watched_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          video_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          user_id: string;
          content: string;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          video_id?: string;
          user_id?: string;
          content?: string;
          parent_id?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link_url: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link_url?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link_url?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

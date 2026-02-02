import { supabase } from '../lib/supabase';

export interface ScoreEntry {
    email: string;
    score: number;
    date: string;
}

export class ScoreManager {
    static async submitScore(email: string, score: number): Promise<boolean> {
        const { error } = await supabase
            .from('game_scores')
            .insert({ email, score });

        if (error) {
            console.error('Error submitting score:', error);
            return false;
        }
        return true;
    }

    static async getLeaderboard(limit = 10): Promise<ScoreEntry[]> {
        const { data, error } = await supabase
            .from('game_scores')
            .select('email, score, created_at')
            .order('score', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return (data || []).map(entry => ({
            email: entry.email,
            score: entry.score,
            date: entry.created_at
        }));
    }
}

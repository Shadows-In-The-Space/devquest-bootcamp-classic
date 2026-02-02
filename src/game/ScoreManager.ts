export interface ScoreEntry {
    email: string;
    score: number;
    date: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/server';

export class ScoreManager {
    static async submitScore(email: string, score: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, score }),
            });

            if (!response.ok) return false;

            const result = await response.json();
            return result.success === true;

        } catch {
            return false;
        }
    }

    static async getLeaderboard(limit = 10): Promise<ScoreEntry[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=${limit}`);

            if (!response.ok) return [];

            const data = await response.json();
            return data;

        } catch {
            return [];
        }
    }
}

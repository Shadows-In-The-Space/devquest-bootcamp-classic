export interface ScoreEntry {
    email: string;
    score: number;
    date: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/server';

export class ScoreManager {
    static async submitScore(email: string, score: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'submit_score',
                    email,
                    score
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error submitting score:', error);
                return false;
            }

            const result = await response.json();
            return result.success === true;

        } catch (error) {
            console.error('Error submitting score:', error);
            return false;
        }
    }

    static async getLeaderboard(limit = 10): Promise<ScoreEntry[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api.php?action=leaderboard&limit=${limit}`);

            if (!response.ok) {
                const error = await response.json();
                console.error('Error fetching leaderboard:', error);
                return [];
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }
}

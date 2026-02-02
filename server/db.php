<?php
/**
 * SQLite Database Initialization
 * Creates and manages the SQLite database connection using PDO
 */

define('DB_PATH', __DIR__ . '/../data/highscores.db');

function getDB(): PDO {
    try {
        $db = new PDO('sqlite:' . DB_PATH);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Enable foreign keys
        $db->query('PRAGMA foreign_keys = ON');

        // Create table if not exists
        $db->query("
            CREATE TABLE IF NOT EXISTS game_scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                score INTEGER NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        ");

        // Create index on score for fast leaderboard queries
        $db->query("
            CREATE INDEX IF NOT EXISTS idx_score
            ON game_scores(score DESC)
        ");

        return $db;

    } catch (PDOException $e) {
        http_response_code(500);
        die(json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ]));
    }
}

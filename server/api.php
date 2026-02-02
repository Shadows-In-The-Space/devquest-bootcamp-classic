<?php
/**
 * REST API for Highscore System
 *
 * Endpoints:
 * POST /api/scores - Submit a new score
 * GET /api/leaderboard - Get top scores
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

/**
 * POST /api/scores
 * Submit a new score
 *
 * Body: { "email": "user@example.com", "score": 1500 }
 * Response: { "success": true }
 */
if ($method === 'POST' && str_ends_with($path, '/api/scores')) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['email']) || !isset($input['score'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing email or score'
        ]);
        exit;
    }

    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    $score = filter_var($input['score'], FILTER_VALIDATE_INT);

    if (!$email || $score === false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid email or score'
        ]);
        exit;
    }

    try {
        $stmt = $db->prepare('INSERT INTO game_scores (email, score) VALUES (:email, :score)');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':score', $score, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(['success' => true]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }

    exit;
}

/**
 * GET /api/leaderboard?limit=10
 * Get top scores
 *
 * Query params: limit (default: 10, max: 100)
 * Response: [{ "email": "...", "score": 1500, "date": "..." }, ...]
 */
if ($method === 'GET' && str_ends_with($path, '/api/leaderboard')) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $limit = min(max($limit, 1), 100); // Clamp between 1 and 100

    try {
        $stmt = $db->prepare('
            SELECT email, score, created_at as date
            FROM game_scores
            ORDER BY score DESC
            LIMIT :limit
        ');
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }

    exit;
}

// 404 for unknown endpoints
http_response_code(404);
echo json_encode([
    'success' => false,
    'error' => 'Endpoint not found'
]);

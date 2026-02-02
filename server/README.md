# PHP + SQLite Backend für Highscores


## Struktur

```
server/
├── api.php          # REST-API-Endpoints
├── db.php           # SQLite-Datenbank-Initialisierung
├── .htaccess        # Apache-Routing & CORS
└── README.md        # Diese Datei

data/
└── highscores.db    # SQLite-Datenbank (wird automatisch erstellt)
```

## API-Endpoints

### POST /api/scores
Score speichern

**Request:**
```bash
curl -X POST http://localhost/server/api/scores \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","score":1500}'
```

**Response:**
```json
{"success":true}
```

### GET /api/leaderboard
Leaderboard abrufen

**Request:**
```bash
curl http://localhost/server/api/leaderboard?limit=10
```

**Response:**
```json
[
  {"email":"player1@test.com","score":2500,"date":"2026-02-02 10:30:15"},
  {"email":"player2@test.com","score":1800,"date":"2026-02-02 09:15:42"}
]
```

## Lokales Testen (ohne Apache)

### Option 1: PHP Built-in Server

```bash
# Im Projekt-Root:
php -S localhost:8000 -t .

# Dann testen:
curl -X POST http://localhost:8000/server/api/scores \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","score":1500}'

curl http://localhost:8000/server/api/leaderboard
```

### Option 2: Mit Vite Dev Server

```bash
# In .env (lokal):
VITE_API_URL=http://localhost:8000/server

# Vite starten:
npm run dev

# In separatem Terminal, PHP-Server starten:
php -S localhost:8000 -t .
```

## Deployment

### Apache/Nginx + PHP

1. **Dateien hochladen:**
   ```bash
   scp -r server/ user@server:/var/www/game/
   scp -r data/ user@server:/var/www/game/
   ```

2. **Permissions setzen:**
   ```bash
   chmod 755 /var/www/game/server
   chmod 666 /var/www/game/data/highscores.db
   chmod 777 /var/www/game/data
   ```

3. **Apache Virtual Host:**
   ```apache
   <VirtualHost *:80>
       ServerName your-domain.com
       DocumentRoot /var/www/game

       <Directory /var/www/game>
           AllowOverride All
           Require all granted
       </Directory>

       # Optional: Separate log files
       ErrorLog ${APACHE_LOG_DIR}/game-error.log
       CustomLog ${APACHE_LOG_DIR}/game-access.log combined
   </VirtualHost>
   ```

4. **Nginx Config:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/game;
       index index.html;

       # Frontend (Static Files)
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Backend (PHP)
       location /server {
           try_files $uri $uri/ /server/api.php?$query_string;

           location ~ \.php$ {
               include snippets/fastcgi-php.conf;
               fastcgi_pass unix:/run/php/php8.2-fpm.sock;
           }
       }
   }
   ```

### Shared Hosting (Standard PHP)

Die meisten Shared-Hosting-Anbieter unterstützen PHP + SQLite out-of-the-box!

1. Via FTP/SFTP hochladen:
   - `server/` → `/public_html/server/`
   - `data/` → `/public_html/data/`

2. Permissions per Hosting-Panel setzen:
   - `data/` → 777 (schreibbar)
   - `data/highscores.db` → 666 (lesen/schreiben)

3. In `.env` setzen:
   ```
   VITE_API_URL=/server
   ```

4. Build deployen:
   ```bash
   npm run build
   # dist/ → /public_html/ hochladen
   ```

## Backup

```bash
# Tägliches Backup per Cronjob:
0 2 * * * cp /var/www/game/data/highscores.db /backups/highscores-$(date +\%Y\%m\%d).db

# Manuelles Backup:
cp data/highscores.db data/highscores-backup-$(date +\%Y\%m\%d).db
```

## Sicherheit

✅ **Was bereits implementiert ist:**
- Prepared Statements (SQL-Injection-sicher)
- Input-Validierung (email, score)
- CORS-Header korrekt gesetzt
- Error-Handling

⚠️ **Für Production zusätzlich:**
- Rate Limiting (z.B. nur 5 Scores pro IP/Stunde)
- HTTPS erzwingen
- API-Key für Score-Submission

## Troubleshooting

### "Database connection failed"
- Prüfen ob `data/` Verzeichnis existiert
- Prüfen ob `data/` schreibbar ist (chmod 777)

### "Endpoint not found"
- Apache: `.htaccess` wird ignoriert → `AllowOverride All` aktivieren
- Nginx: Siehe Nginx-Config oben

### CORS-Fehler im Browser
- Prüfen ob `.htaccess` CORS-Header setzt
- PHP-Server mit `-S` starten für lokales Testen

## Performance

**Benchmarks** (Apache Bench, 1000 Requests):
```bash
# Score-Submission:
ab -n 1000 -c 10 -p score.json -T application/json \
   http://localhost/server/api/scores

# Leaderboard-Queries:
ab -n 1000 -c 10 http://localhost/server/api/leaderboard
```

**Erwartete Performance:**
- Leaderboard: ~5000 req/s (mit Index)
- Score-Insert: ~2000 req/s

## Migration von Supabase

Falls bereits Daten in Supabase existieren:

```bash
# 1. Export aus Supabase (im Supabase Dashboard):
SELECT email, score, created_at FROM game_scores;
# → Als CSV exportieren

# 2. Import in SQLite:
php import.php scores.csv
```

## Häufige Fragen

**Q: Kann ich mehrere SQLite-Datenbanken haben?**
A: Ja, einfach weitere DB-Dateien erstellen und in `db.php` referenzieren.

**Q: Wie viele Scores kann SQLite handeln?**
A: Millionen! SQLite ist für <1GB Daten ideal. Bei 100 Bytes/Score = 10 Millionen Scores.

**Q: Brauche ich eine Extension?**
A: Nein! SQLite ist in PHP standardmäßig enthalten (PDO_SQLITE).

**Q: Funktioniert das auf Windows?**
A: Ja! PHP + SQLite läuft auf Windows, Linux, macOS identisch.

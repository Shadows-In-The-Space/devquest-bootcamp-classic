# PHP SQLite-Extension Installation

## Problem

Die PHP-Installation auf diesem System hat **keine SQLite-Unterstützung**.

```
Error: Database connection failed: could not find driver
```

## Lösung: SQLite-Extension installieren

### Linux (Ubuntu/Debian)

```bash
# PHP-SQLite-Pakete installieren
sudo apt update
sudo apt install php-sqlite3 php-pdo

# PHP neu starten (falls Apache läuft)
sudo systemctl restart apache2

# Oder für PHP-FPM:
sudo systemctl restart php8.3-fpm

# Prüfen ob installiert:
php -m | grep -i sqlite
# Sollte zeigen:
# pdo_sqlite
# sqlite3
```

### Linux (Fedora/RHEL/CentOS)

```bash
# PHP-SQLite-Pakete installieren
sudo dnf install php-pdo php-sqlite3

# PHP neu starten
sudo systemctl restart httpd

# Prüfen:
php -m | grep -i sqlite
```

### macOS (Homebrew)

```bash
# PHP mit SQLite neu installieren
brew reinstall php

# Oder spezifische Version:
brew reinstall php@8.3

# Prüfen:
php -m | grep -i sqlite
```

### Windows (XAMPP/WAMP)

1. **php.ini öffnen:**
   - XAMPP: `C:\xampp\php\php.ini`
   - WAMP: `C:\wamp64\bin\php\php8.x\php.ini`

2. **Extensions aktivieren:**
   ```ini
   # Diese Zeilen auskommentieren (; entfernen):
   extension=pdo_sqlite
   extension=sqlite3
   ```

3. **Server neu starten:**
   - XAMPP: Apache neu starten im Control Panel
   - WAMP: Restart All Services

4. **Prüfen:**
   ```bash
   php -m | findstr sqlite
   ```

## Verifizierung

Nach der Installation testen:

```bash
# Schnelltest:
php -r "new PDO('sqlite::memory:');"

# Sollte keine Fehler zeigen.
# Bei Erfolg: nichts ausgegeben
# Bei Fehler: "could not find driver"
```

## Alternative: Docker verwenden

Falls die Installation nicht klappt, Docker verwenden:

```bash
# Dockerfile erstellen:
cat > Dockerfile <<'EOF'
FROM php:8.3-apache

# SQLite-Extension installieren
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    docker-php-ext-install pdo pdo_sqlite && \
    rm -rf /var/lib/apt/lists/*

# Apache Rewrite Module aktivieren
RUN a2enmod rewrite

# Code kopieren
COPY . /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html/data && \
    chmod 777 /var/www/html/data

EXPOSE 80
EOF

# Image bauen:
docker build -t game-backend .

# Container starten:
docker run -d -p 8080:80 \
  -v $(pwd)/data:/var/www/html/data \
  game-backend

# Testen:
curl http://localhost:8080/server/api/leaderboard
```

## Nach Installation: Tests ausführen

```bash
# PHP-Server starten:
php -S localhost:8000 router.php

# In neuem Terminal, Tests ausführen:
./server/test-api.sh http://localhost:8000
```

## Production-Server

**Gut Nachrichten:** Die meisten Shared-Hosting und VPS haben SQLite standardmäßig!

### Prüfen auf dem Server:

```bash
ssh user@your-server
php -m | grep sqlite

# Falls nicht installiert:
sudo apt install php-sqlite3 php-pdo
```

## Troubleshooting

### "Extension already loaded" Warning

Ignorieren - Extension ist installiert, funktioniert.

### "Permission denied" beim Schreiben

```bash
# data/ Verzeichnis schreibbar machen:
chmod 777 data/

# Oder nur für Apache-User:
sudo chown www-data:www-data data/
sudo chmod 755 data/
```

### Database locked

SQLite ist single-writer. Bei hohem Traffic:
- WAL-Mode aktivieren (automatisch in db.php)
- Oder zu PostgreSQL wechseln für Multi-Writer

## Nächste Schritte

1. SQLite-Extension installieren (siehe oben)
2. Tests ausführen: `./server/test-api.sh`
3. Bei Erfolg: Commit & Push
4. Deployment planen

## Fragen?

- PHP-Version prüfen: `php -v`
- Alle Extensions: `php -m`
- php.ini Pfad: `php --ini`

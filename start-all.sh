#!/bin/bash

# ==============================================================================
# FaultLens Microservices (Eureka Service Discovery) + Python AI + Database Script
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Ensure JAVA_HOME is exported for Java Spring Boot microservices
if [ -d "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home" ]; then
    export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home"
elif [ -x "/usr/libexec/java_home" ] && /usr/libexec/java_home >/dev/null 2>&1; then
    export JAVA_HOME="$(/usr/libexec/java_home 2>/dev/null)"
fi

if [ -n "$JAVA_HOME" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
    JAVA_CMD="$JAVA_HOME/bin/java"
else
    JAVA_CMD="java"
fi

# Default MySQL Persistence Configuration
DB_NAME="fault_lens"
export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:mysql://localhost:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}"
export SPRING_DATASOURCE_DRIVER="${SPRING_DATASOURCE_DRIVER:-com.mysql.cj.jdbc.Driver}"
export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-root}"
export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-root@123}"

echo "======================================================================"
echo " Starting FaultLens System with Eureka Service Discovery & MySQL "
echo "======================================================================"

# Kill any stale background microservice processes on ports before startup
echo "[0/5] Clearing stale microservice ports..."
lsof -ti:8761,8080,8081,8082,8083,8084,8000,5173 | xargs kill -9 2>/dev/null || true

# 1. Database Check & Initialization
echo "[1/5] Checking Database configuration..."
MYSQL_PASS="${SPRING_DATASOURCE_PASSWORD:-root@123}"
if mysql -u root -p"$MYSQL_PASS" -e "SHOW DATABASES;" >/dev/null 2>&1; then
    echo "  -> Connected to MySQL (root:$MYSQL_PASS)."
    export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    export SPRING_DATASOURCE_DRIVER="com.mysql.cj.jdbc.Driver"
    export SPRING_DATASOURCE_USERNAME="root"
    export SPRING_DATASOURCE_PASSWORD="$MYSQL_PASS"
elif mysql -h 127.0.0.1 -u root -p"$MYSQL_PASS" -e "SHOW DATABASES;" >/dev/null 2>&1; then
    echo "  -> Connected to MySQL via TCP 127.0.0.1 (root:$MYSQL_PASS)."
    export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    export SPRING_DATASOURCE_DRIVER="com.mysql.cj.jdbc.Driver"
    export SPRING_DATASOURCE_USERNAME="root"
    export SPRING_DATASOURCE_PASSWORD="$MYSQL_PASS"
elif mysql -u root -e "SHOW DATABASES;" >/dev/null 2>&1; then
    echo "  -> Connected to MySQL (root, no password)."
    export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    export SPRING_DATASOURCE_DRIVER="com.mysql.cj.jdbc.Driver"
    export SPRING_DATASOURCE_USERNAME="root"
    export SPRING_DATASOURCE_PASSWORD=""
elif mysql -u root -prootpassword -e "SHOW DATABASES;" >/dev/null 2>&1; then
    echo "  -> Connected to MySQL (root:rootpassword)."
    export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    export SPRING_DATASOURCE_DRIVER="com.mysql.cj.jdbc.Driver"
    export SPRING_DATASOURCE_USERNAME="root"
    export SPRING_DATASOURCE_PASSWORD="rootpassword"
else
    echo "  -> Local MySQL daemon not active/authenticated; microservices will use embedded H2 MySQL mode."
    export SPRING_DATASOURCE_URL="jdbc:h2:mem:${DB_NAME};MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE"
    export SPRING_DATASOURCE_DRIVER="org.h2.Driver"
    export SPRING_DATASOURCE_USERNAME="sa"
    export SPRING_DATASOURCE_PASSWORD=""
fi

# 2. Build & Package Java Microservices (if missing)
echo "[2/5] Checking Java Spring Boot Microservice binaries..."
if [ ! -f "$ROOT_DIR/backend/eureka-server/target/eureka-server-1.0.0.jar" ]; then
    echo "  -> Compiling microservices with Maven..."
    cd "$ROOT_DIR/backend" && mvn clean package -DskipTests && cd "$ROOT_DIR"
else
    echo "  -> Microservice binaries ready."
fi

# 3. Start Eureka Discovery Server (Port 8761)
echo "[3/5] Launching Netflix Eureka Discovery Server (http://localhost:8761)..."
"$JAVA_CMD" -jar "$ROOT_DIR/backend/eureka-server/target/eureka-server-1.0.0.jar" > "$ROOT_DIR/eureka.log" 2>&1 &
EUREKA_PID=$!

echo "Waiting 6 seconds for Eureka Server to initialize..."
sleep 6

# 4. Start Microservices & Python AI Service
echo "[4/5] Launching Microservices & Python AI Service..."

# Python AI Service (Port 8000)
AI_DIR="$ROOT_DIR/ai-service"
if [ ! -d "$AI_DIR" ]; then
    AI_DIR="$ROOT_DIR/ai"
fi
cd "$AI_DIR"
if [ -d "venv" ]; then
    "$AI_DIR/venv/bin/python3" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > "$ROOT_DIR/ai.log" 2>&1 &
    AI_PID=$!
elif command -v uvicorn >/dev/null 2>&1; then
    uvicorn app.main:app --host 0.0.0.0 --port 8000 > "$ROOT_DIR/ai.log" 2>&1 &
    AI_PID=$!
elif command -v python3 >/dev/null 2>&1; then
    python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > "$ROOT_DIR/ai.log" 2>&1 &
    AI_PID=$!
fi
cd "$ROOT_DIR"

# Java Microservices registering with Eureka
"$JAVA_CMD" -jar "$ROOT_DIR/backend/auth-service/target/auth-service-1.0.0.jar" > "$ROOT_DIR/auth.log" 2>&1 &
AUTH_PID=$!

"$JAVA_CMD" -jar "$ROOT_DIR/backend/equipment-service/target/equipment-service-1.0.0.jar" > "$ROOT_DIR/equipment.log" 2>&1 &
EQ_PID=$!

"$JAVA_CMD" -jar "$ROOT_DIR/backend/sensor-service/target/sensor-service-1.0.0.jar" > "$ROOT_DIR/sensor.log" 2>&1 &
SENSOR_PID=$!

"$JAVA_CMD" -jar "$ROOT_DIR/backend/maintenance-service/target/maintenance-service-1.0.0.jar" > "$ROOT_DIR/maintenance.log" 2>&1 &
MAINT_PID=$!

sleep 5

"$JAVA_CMD" -jar "$ROOT_DIR/backend/api-gateway/target/api-gateway-1.0.0.jar" > "$ROOT_DIR/gateway.log" 2>&1 &
GATEWAY_PID=$!

sleep 3

# 5. Start React Frontend
echo "[5/5] Starting React JS Frontend (http://localhost:5173)..."
cd "$ROOT_DIR"
if [ ! -d "node_modules" ]; then
    echo "  -> node_modules not found. Running npm install..."
    npm install
fi

# Cleanup on exit
trap "kill -9 $EUREKA_PID $AI_PID $AUTH_PID $EQ_PID $SENSOR_PID $MAINT_PID $GATEWAY_PID 2>/dev/null" EXIT

echo "======================================================================"
echo " FaultLens System Operational! Access Frontend at http://localhost:5173"
echo "======================================================================"
npm run dev -- --host 0.0.0.0 --port 5173

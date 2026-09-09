#!/bin/bash
# Wrapper script to execute full FaultLens service launch pipeline
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$SCRIPT_DIR/start-all.sh" "$@"

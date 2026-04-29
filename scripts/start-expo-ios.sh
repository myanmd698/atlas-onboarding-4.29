#!/usr/bin/env bash
# iOS: start Metro, then open Expo Go. Uses LAN (not --localhost) by default — Expo Go
# often cannot reach 127.0.0.1 on iOS 18+ / recent sim runtimes, which shows
# "Could not connect to the server" even when Metro is running.
# Override: EXPO_USE_LOCALHOST=1 to force 127.0.0.1.
# EXPO_LAN_IP=192.168.x.x to pin a host IP; EXPO_PORT=8082 to use another port.
# Default: Metro always binds to 8081. If a stale dev server is already there, it is
# stopped first (set EXPO_NO_PORT_KILL=1 to skip and fail if busy instead).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -n "${EXPO_PORT:-}" ]; then
  PORT="$EXPO_PORT"
else
  PORT=8081
fi

# Avoid “could not connect” when an old Metro took 8082+ but Expo Go still expects 8081.
if [ -z "${EXPO_NO_PORT_KILL:-}" ]; then
  pids_for_port() { lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null || true; }
  for _ in 1 2; do
    if [ -n "$(pids_for_port "$PORT")" ]; then
      echo "Port $PORT in use — stopping stale listener (usually Metro)..." >&2
      pids_for_port "$PORT" | xargs kill -9 2>/dev/null || true
      sleep 0.5
    else
      break
    fi
  done
  if [ -n "$(pids_for_port "$PORT")" ]; then
    echo "Port $PORT still in use. Set EXPO_NO_PORT_KILL=1 and free it manually, or EXPO_PORT=8082" >&2
    exit 1
  fi
fi

# Primary Wi‑Fi / Ethernet; fallbacks for Mac without en0=Wi-Fi, etc.
LAN_IP="${EXPO_LAN_IP:-}"
if [ -z "$LAN_IP" ] && [ -z "${EXPO_USE_LOCALHOST:-}" ]; then
  LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || true)
  [ -n "$LAN_IP" ] || LAN_IP=$(ipconfig getifaddr en1 2>/dev/null || true)
  [ -n "$LAN_IP" ] || LAN_IP=$(ipconfig getifaddr en2 2>/dev/null || true)
fi

# Ensure Simulator is open and a device is booted
if command -v open >/dev/null 2>&1; then
  open -a Simulator 2>/dev/null || true
  sleep 1
fi
if command -v xcrun >/dev/null 2>&1; then
  if ! xcrun simctl list devices 2>/dev/null | grep -q "(Booted)"; then
    for name in "iPhone 17 Pro" "iPhone 17" "iPhone 16" "iPhone 16e" "iPhone 15"; do
      if xcrun simctl boot "$name" 2>/dev/null; then
        break
      fi
    done
    sleep 3
  fi
fi

if command -v xcrun >/dev/null 2>&1; then
  xcrun simctl launch booted host.exp.Exponent 2>/dev/null || true
  sleep 2
fi

if [ -n "${EXPO_USE_LOCALHOST:-}" ] || [ -z "$LAN_IP" ]; then
  EXPOURL="exp://127.0.0.1:${PORT}"
  export REACT_NATIVE_PACKAGER_HOSTNAME="${REACT_NATIVE_PACKAGER_HOSTNAME:-127.0.0.1}"
  npx expo start --localhost -p "$PORT" &
else
  EXPOURL="exp://${LAN_IP}:${PORT}"
  export REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP"
  npx expo start --host lan -p "$PORT" &
fi

BUNDLER_PID=$!
cleanup() {
  kill "$BUNDLER_PID" 2>/dev/null || true
}
trap cleanup INT TERM

for _ in {1..100}; do
  if nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
    sleep 0.5
    break
  fi
  sleep 0.3
 done

if command -v xcrun >/dev/null 2>&1; then
  OPEN_OK=0
  for _ in 1 2 3 4 5; do
    if xcrun simctl openurl booted "$EXPOURL"; then
      OPEN_OK=1
      break
    fi
    xcrun simctl launch booted host.exp.Exponent 2>/dev/null || true
    sleep 2
  done
  if [ "$OPEN_OK" -ne 1 ]; then
    echo "simctl openurl was slow or failed. In Expo Go, open: $EXPOURL" >&2
  fi
else
  echo "Expo: $EXPOURL" >&2
fi

wait "$BUNDLER_PID"

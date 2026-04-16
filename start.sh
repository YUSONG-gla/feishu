#!/usr/bin/env bash
cd heart/backend
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"

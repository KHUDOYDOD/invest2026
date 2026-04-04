#!/bin/bash
cd invest2026
set -a
source .env.production
set +a
node check-project-simple.js
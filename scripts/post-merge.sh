#!/bin/bash
set -euo pipefail
pnpm install --frozen-lockfile
# Schema changes require a reviewed migration against an approved database.
printf '%s\n' 'Dependencies updated. Database schema was not changed; migrations are a separate approved action.'

#!/usr/bin/env bash
# Grammar check markdown files using pandoc + harper-cli
# Usage: ./scripts/grammar-check.sh [files...]
# If no files specified, checks all blog posts

set -euo pipefail

DICT_PATH=".harper/dictionary.txt"
exit_code=0

# Use provided files or default to all blog posts
if [[ $# -gt 0 ]]; then
  files=("$@")
else
  files=(src/content/blog/*.md)
fi

for file in "${files[@]}"; do
  if [[ -f "$file" ]]; then
    echo "Checking: $file"
    # Strip markdown syntax with pandoc, then run harper
    # Use -f markdown to handle .mdx files without warnings
    if ! pandoc -f markdown -t plain "$file" | harper-cli lint --user-dict-path "$DICT_PATH"; then
      exit_code=1
    fi
    echo ""
  else
    echo "File not found: $file"
    exit_code=1
  fi
done

exit $exit_code

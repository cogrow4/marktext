#!/bin/bash

# Script to update all MarkText references to NovelCraft
echo "🔄 Updating MarkText references to NovelCraft..."

# Function to replace text in files
replace_in_files() {
    local pattern="$1"
    local replacement="$2"
    local files="$3"
    
    echo "Replacing '$pattern' with '$replacement' in $files"
    find $files -type f -name "*.js" -o -name "*.vue" -o -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.xml" -o -name "*.nsh" | xargs sed -i "s/$pattern/$replacement/g"
}

# Update common patterns
replace_in_files "marktext" "novelcraft" "src/"
replace_in_files "MarkText" "NovelCraft" "src/"
replace_in_files "MARKTEXT" "NOVELCRAFT" "src/"

# Update specific file patterns
replace_in_files "marktext" "novelcraft" "docs/"
replace_in_files "MarkText" "NovelCraft" "docs/"

# Update resource files
replace_in_files "marktext" "novelcraft" "resources/"
replace_in_files "MarkText" "NovelCraft" "resources/"

# Update test files
replace_in_files "marktext" "novelcraft" "test/"
replace_in_files "MarkText" "NovelCraft" "test/"

# Update tool files
replace_in_files "marktext" "novelcraft" "tools/"
replace_in_files "MarkText" "NovelCraft" "tools/"

# Update specific URLs
replace_in_files "github.com/marktext/marktext" "github.com/novelcraft/novelcraft" "."
replace_in_files "github.com/marktext" "github.com/novelcraft" "."

# Update app IDs and names
replace_in_files "com.github.marktext.marktext" "com.novelcraft.app" "."
replace_in_files "marktext-" "novelcraft-" "."

echo "✅ Reference update complete!"
echo ""
echo "📋 Summary of changes:"
echo "- Updated all MarkText references to NovelCraft"
echo "- Updated GitHub repository URLs"
echo "- Updated app IDs and package names"
echo "- Updated file names and paths"
echo ""
echo "🔍 You may want to review the changes and test the application."
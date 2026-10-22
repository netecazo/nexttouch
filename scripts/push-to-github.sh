#!/bin/bash

echo "🚀 NextTouch GitHub Push Script"
echo ""
echo "To push to GitHub, you need a Personal Access Token."
echo ""
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Give it 'repo' access"
echo "4. Copy the token"
echo ""
read -p "Enter your GitHub Personal Access Token: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo "📦 Pushing to GitHub..."
git remote set-url github https://$TOKEN@github.com/netecazo/nexttouch.git
git push github main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code is now on GitHub:"
    echo "   https://github.com/netecazo/nexttouch"
    echo ""
    echo "Next step: Import this repo into Vercel!"
else
    echo "❌ Push failed. Please check your token and try again."
fi

#!/bin/bash

echo "Starting the main.sh script..."
export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

echo "Cloning repository: $GIT_REPOSITORY_URL"
git clone "$GIT_REPOSITORY_URL" /home/app/output

echo "Repository cloned. Executing Node.js script..."
node script.js
echo "Node.js script exited with code $?"
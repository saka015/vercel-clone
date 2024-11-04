FROM ubuntu:focal

# Update package lists and install curl and other dependencies
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /home/app

# Copy files into the container
COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .

# Install npm dependencies
RUN npm install

# Make scripts executable
RUN chmod +x main.sh && chmod +x script.js

# Set the entry point
ENTRYPOINT [ "/home/app/main.sh" ]
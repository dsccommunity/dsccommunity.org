# Use the official VS Code dev container as the base image
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    git \
    gh \
    jq \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Hugo
COPY .versions.json /tmp/.versions.json
RUN HUGO_VERSION=$(jq -r '.hugo.version' /tmp/.versions.json) && \
    wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb && \
    dpkg -i hugo_extended_${HUGO_VERSION}_linux-amd64.deb && \
    rm hugo_extended_${HUGO_VERSION}_linux-amd64.deb /tmp/.versions.json

# Set the default user
USER vscode

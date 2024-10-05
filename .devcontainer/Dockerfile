# Use the official VS Code dev container as the base image
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    git \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Hugo
ARG HUGO_VERSION=0.135.0
RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-amd64.deb \
    && dpkg -i hugo_${HUGO_VERSION}_linux-amd64.deb \
    && rm hugo_${HUGO_VERSION}_linux-amd64.deb

# Set the default user
USER vscode

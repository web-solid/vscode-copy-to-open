FROM mcr.microsoft.com/devcontainers/universal:2

# Install Xvfb
RUN apt-get update && apt-get install -y xvfb && npm install -g vsce && yarn

# CMD ["yarn"]
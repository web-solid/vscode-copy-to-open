FROM mcr.microsoft.com/devcontainers/universal:2

# Install Xvfb
RUN apt-get update && apt-get install -y xvfb

# Start Xvfb
CMD ["xvfb-run", "-s", "'-screen 0 1920x1080x24'", "code"]
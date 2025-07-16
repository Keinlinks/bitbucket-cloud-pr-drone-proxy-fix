# Drone CI - Bitbucket Cloud PR Solution

## Overview

This lightweight proxy server acts as a middleware layer to resolve compatibility issues between **Drone CI** and **Bitbucket Cloud**, specifically problems related to **Pull Requests**. It is designed to be easily deployable and highly configurable.

This fix is useful only if you want:
- Drone to build your **Pull Requests** with Bitbucket Cloud.
- You don't mind Drone building push events only on the branches you explicitly configure in Environment Variables (like `main` or `develop`).

## Installation

### Option 1: Local Installation

For local installation, you need **Node.js 18 or higher**.

- Clone the repository:

    ```bash
    git clone https://github.com/Keinlinks/bitbucket-cloud-pr-drone-proxy-fix.git
    cd bitbucket-cloud-pr-drone-proxy-fix
    ```

- Install dependencies:

    ```bash
    npm install
    ```
- Create your .env file

- Start the proxy with the entrypoint script (this creates an SSL certificate for HTTPS):

    ```bash
    chmod +x entrypoint.sh
    ./entrypoint.sh
    ```

- Or start it directly:

    ```bash
    npm run start
    ```

### Option 2: Docker (Recommended)

For this option, you need to create your own image with the Dockerfile.

- Clone the repository:

    ```bash
    git clone https://github.com/Keinlinks/bitbucket-cloud-pr-drone-proxy-fix.git
    cd bitbucket-cloud-pr-drone-proxy-fix
    ```

- Build your image:

    ```bash
    docker build -t bitbucket-cloud-pr-drone-proxy-fix .
    ```

- Start the container in standalone mode:

    ```bash
    docker run -d ^
      --name bitbucket_cloud_fix ^
      --restart always ^
      -e TARGET_URL=http://drone-server:80 ^
      -e PROXY_PORT=443 ^
      -e USE_HTTPS=true ^
      -e BRANCHES_ALLOWED_PUSH=main,develop ^
      -p 443:443 ^
      bitbucket-cloud-pr-drone-fix:latest
    ```

- Or start the containers with Docker Compose (configure your Drone container):

    ```bash
    docker compose up -d
    ```

## Environment

- **TARGET_URL**: Specifies the destination URL where the reverse proxy forwards incoming requests.
- **PROXY_PORT**: Defines the port on which the reverse proxy listens for incoming connections.
- **USE_HTTPS**: Configures the proxy to use HTTPS for secure communication.
- **BRANCHES_ALLOWED_PUSH**: Specifies a comma-separated list of branch names that the proxy allows for push-related actions.
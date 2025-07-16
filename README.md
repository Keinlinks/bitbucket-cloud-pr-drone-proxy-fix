# Drone CI - Bitbucket Cloud PR Solution

## Overview

This lightweight proxy server acts as a middleware layer to resolve compatibility issues between **Drone CI** and **Bitbucket Cloud**, specifically problems related to **Pull Requests**. It is designed to be easily deployable and highly configurable.
This is useful only if you want:
- Drone build your Pull request with Bitbucket Cloud.
- You don't mind Drone building push events only on the branches you explicitly configure in the code (like "main" or "develop").

## Installation

### Option 1: Local Installation
For local installation you need Nodejs +18.0.
- Clone the repository

    ```bash
	    git clone https://github.com/Keinlinks/bitbucket-cloud-pr-drone-proxy-fix.git
	    cd bitbucket-cloud-pr-drone-proxy-fix
    ```
- Install dependencies
	```bash
	    npm install
    ```
- Start proxy with entrypoint (This creates an SSL signature for Https)
	```bash
		chmod +x entrypoint.sh
	    ./entrypoint.sh
    ```
- Or start directly
	```bash
		npm run start
    ```
### Option 2: Docker (Recommended)
For this options you need created your own image with the Dockerfile.
- Clone the repository
    ```bash
	    git clone https://github.com/Keinlinks/bitbucket-cloud-pr-drone-proxy-fix.git
	    cd bitbucket-cloud-pr-drone-proxy-fix
    ```
- Build your image

    ```bash
	    docker build -t bitbucket-cloud-pr-drone-proxy-fix .
    ```
- Start the container standalone
	```bash
	    docker run -d ^
			--name bitbucket_cloud_fix ^
			--restart always ^
			-e TARGET_URL=http://drone-server:3002 ^
			-e PROXY_PORT=443 ^
			-e ENVIRONMENT=production ^
			-e USE_HTTPS=true ^
			-p 443:443 ^
			bitbucket-cloud-pr-drone-fix:latest
    ```
 - Or start the containers with Docker Compose (Configure your drone container)
	```bash
	    docker compose up -d
    ```
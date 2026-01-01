# Use a base image with Java 17 (required for Android Gradle Plugin 8.0+)
FROM eclipse-temurin:17-jdk-jammy

# Set environment variables
ENV ANDROID_SDK_ROOT /opt/android-sdk
ENV PATH ${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools

# Install necessary system tools
# Install Node.js 20 (LTS) - Needed for our build scripts
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Setup Android SDK
WORKDIR /opt
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
    && curl -o sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip \
    && unzip sdk-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
    && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm sdk-tools.zip

# Accept licenses and install platform tools
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Set working directory for the app
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including the 'tsx' and 'fs-extra' needed for build scripts)
RUN npm install

# Copy the rest of the application code
COPY . .

# We don't build immediately. We provide an entrypoint that can take env vars.
# Usage: docker run -e APP_NAME="..." -e APP_URL="..." -e BUILD_ID="..." ...
CMD ["npx", "tsx", "scripts/build-action.ts"]

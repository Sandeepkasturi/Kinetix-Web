# Base image with OpenJDK 17
FROM openjdk:17-slim

# Environment Variables
ENV ANDROID_SDK_ROOT="/opt/android-sdk"
ENV PATH="${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools"
ENV API_LEVEL=34
ENV BUILD_TOOLS_VERSION="34.0.0"

# Install Dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Setup Android SDK Directory
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools

# Download Android SDK Command Line Tools
# Check https://developer.android.com/studio#command-tools for latest version
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip \
    && unzip cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
    && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
    && rm cmdline-tools.zip

# Accept Licenses
RUN yes | sdkmanager --licenses

# Install SDK Packages
RUN sdkmanager "platform-tools" \
    "platforms;android-${API_LEVEL}" \
    "build-tools;${BUILD_TOOLS_VERSION}" \
    "extras;google;m2repository" \
    "extras;android;m2repository"

# Working Directory for App
WORKDIR /app

# Copy Application Codes
COPY package*.json ./
RUN npm install
COPY . .

# Build Next.js App (Or just run the worker script directly)
RUN npm run build

# Expose Port (if needed for API)
EXPOSE 3000

# Start command
CMD ["npm", "start"]

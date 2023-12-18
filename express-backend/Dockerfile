# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm i -g nodemon
RUN npm install

# Copy the rest of the application code to the working directory
COPY . . 

# Expose port 3080
EXPOSE 3080

# Set environment variables
ENV NODE_ENV=production

# Fetch environment variables and secrets from GitHub Secrets Manager
# Replace <YOUR_SECRET_NAME> with the actual name of your secret
#RUN apt-get update && apt-get install -y curl && \
#    curl -H "Authorization: Bearer $GITHUB_TOKEN" \
#    -H "Accept: application/vnd.github.v3.raw" \
#    -o .env "https://api.github.com/repos/<YOUR_USERNAME>/<YOUR_REPOSITORY>/actions/secrets/<YOUR_SECRET_NAME>"

# Start the Node.js application
CMD ["nodemon", "./src/index.js"] 
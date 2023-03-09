# Use the official Node.js image as the base image
FROM node:18.15-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code to the container
COPY . .

# Expose the port the server will listen on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start:dev"]

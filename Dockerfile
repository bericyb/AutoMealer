# Use an official Node.js runtime as the parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Bundle the application source code inside the container
COPY . .

# Set the environment variable for port (optional, just to make it explicit)
ENV PORT=6666

# Expose port 6666 to be accessible outside the container
EXPOSE 6666

# Define the command to run when the container starts
CMD [ "npm", "start" ]

# Use the official Node.js image as a base
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]

# docker build -t mwbe .
# docker tag mwbe lthung0412/mwbe
#test deploy
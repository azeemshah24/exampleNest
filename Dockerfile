# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /wrk-backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Create a "dist" folder with the production build
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start"]

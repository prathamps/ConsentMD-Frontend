# Use a modern Node.js version as the base image
FROM node:22-alpine AS base

WORKDIR /usr/src/app
COPY . ./
RUN npm install --legacy-peer-deps
RUN npm run-script build


# Stage 2 - Deploy with NGNIX
FROM nginx:1.15.2-alpine

COPY --from=builder /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]



# # Copy package.json and package-lock.json first to leverage Docker cache
# COPY package*.json ./

# # Install dependencies
# RUN npm install


# # Copy the rest of the application code
# COPY . .

# # Expose port 3000 to the outside world
# EXPOSE 3000

# # The command to run when the container starts for development
# CMD ["npm", "run", "dev"] 
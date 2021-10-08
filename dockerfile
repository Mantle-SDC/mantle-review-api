FROM node:16.10-slim

# Default environment variables. Use --env with docker run to change as needed.
ENV DB_HOST='localhost' DB_PORT=27017 DB_NAME='mantle' SERVER_PORT=3000
COPY . api_server/
WORKDIR /api_server
RUN npm install --production
EXPOSE $SERVER_PORT/tcp

CMD ["npm", "start"]

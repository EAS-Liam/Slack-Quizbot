FROM node:16.13.0
WORKDIR /src
ENV PORT 3000
COPY package.json /src/package.json
RUN npm install
COPY . /src
CMD ["node", "/src/app.js"]
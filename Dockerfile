FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && yarn --force

COPY . .

RUN yarn build

CMD ["npm", "run", "start" , ":", "dev"]
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <h1 align="center">Test Instance Posts blog v0.0.1</h1>
</p>

- NestJS(^10.0.0) + Node(^20.3.1).
- DDD - pattern project with SOLID.
- CRUD/TypeOrm/Pg
- Docker container.

---

# Env

Чтобы проект встал и не ругался на ошибки - скопируйте .env.example со своими данными

---

# :smile: Запуск

- Для настройки конфигов (1)
- Для запуска дев мода (2)
- Для прода (3)

### (1) Настройка конфигов

#### The first

- need to clone this repo to u pc (git clone https://github.com/soorq/Back_End-News.git)

#### The second

- is setup u db, get a conf (If u havent a db, u cant to start this app)

#### The third

- is need setup .env file \*(create .env and copy a values from .env.example)

#### The four step

- is need add a packages \*(node_modules)

### (2) Для запуска дев мода

| npm               | yarn           | pnpm           |
| ----------------- | -------------- | -------------- |
| npm run start:dev | yarn start:dev | pnpm start:dev |

### (3) Для прода

| Пункты | npm           | yarn       | pnpm       |
| ------ | ------------- | ---------- | ---------- |
| 1      | npm run build | yarn build | pnpm build |
| 2      | npm run start | yarn start | pnpm start |

- [x] Обязательно завести .env , далее под пункт Env взять все енвайромент и подставить

> После установки - обращаться по этой ссылки [http://localhost:${U_PORT || 1010}/api](http://localhost:1010/api)

> Чтоб зайти в сваггер документацию перейти по ссылки - [http://localhost:${U_PORT || 1010}/ui](http://localhost:1010/ui)

# Docker. Как запустить?


---

### Запуск Docker

> docker-compose up

#### В нем уже настроены ваши контейнеры и образ приложения,

- postgres
- pgadmin ./\. запускается после успешного запуска контейнера postgres
- main ./\. запускается после успешного запуска контейнера postgres

> Обязательно! В docker-compose.yml в контейнере - main, показать зависимости, enviroment - u ПЕРЕИМЕНУЙТЕ docker-compose.example.yml -> docker-compose.yml

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && yarn --force

COPY . .

RUN yarn build

CMD ["npm", "run", "start" , ":", "dev"]
```

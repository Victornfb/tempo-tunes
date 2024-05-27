FROM node:20.11.1-alpine

RUN npm install -g pnpm

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY . .

RUN pnpm install 

RUN pnpm build

EXPOSE 4000

CMD ["pnpm", "run", "start"]
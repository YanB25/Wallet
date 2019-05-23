
FROM node:12-slim

RUN mkdir -p /home/Nebula
WORKDIR /home/Nebula

COPY . /home/Nebula
WORKDIR /home/Nebula
RUN npm install
EXPOSE 3000
CMD ["npm","run dev"]

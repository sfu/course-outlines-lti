FROM node:10.16.3-alpine

WORKDIR /usr/src/app
# COPY package*.json ./
# COPY yarn.lock ./
COPY . .
RUN mkdir -p /home/nodejs/.cache/yarn
# RUN yarn install --pure-lockfile
RUN npm -g i @architect/architect
CMD ["arc", "sandbox"]
EXPOSE 3333
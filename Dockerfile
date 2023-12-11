FROM alpine
USER root
RUN apk add --no-cache \
      nss \
      freetype \
      nodejs \
      yarn

WORKDIR /usr/app
COPY ./ /usr/app

RUN apk add --update npm
RUN npm install
RUN npm install --global rimraf

WORKDIR /usr/app
CMD ["npm", "start", "--", "projectPath=/input"]
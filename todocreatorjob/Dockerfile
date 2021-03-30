FROM node:14

WORKDIR /usr/src/app

COPY createdailytodo.sh createdailytodo.sh

RUN chmod +x createdailytodo.sh
RUN apt-get update
RUN apt install jq -y

ENTRYPOINT [ "/usr/src/app/createdailytodo.sh" ] 
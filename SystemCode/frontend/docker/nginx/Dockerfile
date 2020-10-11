FROM nginx:1.15.12

# set environment
ENV BASEDIR /vlab

# copy application to web root directory
WORKDIR ${BASEDIR}
COPY . ${BASEDIR}
RUN rm $BASEDIR/Dockerfile

# replace nginx configuration
RUN rm /etc/nginx/conf.d/*.conf
RUN mv $BASEDIR/*.conf /etc/nginx/conf.d/
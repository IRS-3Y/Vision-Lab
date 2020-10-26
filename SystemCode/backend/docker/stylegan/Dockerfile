FROM vlab-backend-base-tf1:dev

# install extra dependencies
RUN pip install scipy==1.3.3 requests==2.22.0 Pillow==6.2.1

# copy preloaded models
COPY instance ${BASEDIR}/instance
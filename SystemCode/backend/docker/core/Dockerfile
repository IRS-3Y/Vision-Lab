FROM vlab-backend-base:dev

# install extra dependencies
RUN pip install scikit-learn

# copy preloaded models
COPY instance ${BASEDIR}/instance

# copy initial setup script
COPY setup.py ${BASEDIR}/app/

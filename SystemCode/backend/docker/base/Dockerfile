FROM tensorflow/tensorflow:2.3.0-gpu

# install dependencies
RUN apt update && \
    apt install -y default-libmysqlclient-dev && \
    pip install flask flask_cors opencv-python-headless mysqlclient SQLAlchemy

# set environment
ENV BASEDIR /vlab
ENV FLASK_APP="backend"

# copy app files
WORKDIR ${BASEDIR}
COPY app ${BASEDIR}/app
COPY backend.py ${BASEDIR}/

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]

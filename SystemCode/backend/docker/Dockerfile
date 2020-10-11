FROM tensorflow/tensorflow:2.3.0-gpu

# set environment
ENV BASEDIR /vlab
ENV FLASK_APP="backend"

# install dependencies
RUN pip install flask opencv-python-headless

# copy app files
WORKDIR ${BASEDIR}
COPY app ${BASEDIR}/app
COPY instance ${BASEDIR}/instance
COPY backend.py ${BASEDIR}/

ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]

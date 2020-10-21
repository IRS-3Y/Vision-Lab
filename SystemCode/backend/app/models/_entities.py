import os
from uuid import uuid4
from datetime import datetime

from ..entities import get_session, Model
from ._utils import model_path


def get_models(type):
  session = get_session()
  return session.query(Model).filter_by(type=type).all()


def create_model(**props):
  session = get_session()
  model = Model(**props)
  session.add(model)
  session.commit()


def update_model(uuid, status):
  session = get_session()
  model = session.query(Model).filter_by(uuid=uuid).first()
  if model is not None:
    model.status = int(status)
    session.commit()
    return {'uuid': uuid, 'status': status}
  else:
    return {'uuid': uuid}


def delete_model(uuid):
  session = get_session()
  model = session.query(Model).filter_by(uuid=uuid).first()
  if model is not None:
    session.delete(model)
    session.commit()
    return {'uuid': uuid, 'type': model.type, 'name': model.name, 'version': model.version, 'label': model.label}
  else:
    return {'uuid': uuid}


def upload_model(type, name, label, filepath):
  uuid = uuid4()
  version = datetime.now().strftime('%Y%m%d_%H%M%S')

  filetype = f".{filepath.split('.')[-1]}"
  modelpath = model_path(name, version, file_ext=filetype)
  os.rename(filepath, modelpath)

  create_model(uuid=uuid, type=type, name=name, version=version, label=label, status=0, ensemble=0)
  return {'uuid': uuid, 'type': type, 'name': name, 'version': version, 'label': label}

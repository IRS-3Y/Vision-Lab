import os
from uuid import uuid4

from ..entities import session_scope, Model
from ._utils import model_path, new_model_version


def get_model(uuid):
  with session_scope() as session:
    model = session.query(Model).filter_by(uuid=uuid).first()
    if model is not None:
      return (model.uuid, model.name, model.version)
    else:
      return (None, None, None)


def get_models(type):
  with session_scope() as session:
    models = session.query(Model).filter_by(type=type).order_by(Model.name, Model.version).all()
    arr = []
    for m in models:
      arr.append({
        'key': m.uuid,
        'uuid': m.uuid,
        'type': m.type,
        'name': m.name,
        'version': m.version,
        'label': m.label,
        'status': m.status,
        'ensemble': m.ensemble,
        'base_models': m.base_models
      })
    return arr


def create_model(**props):
  with session_scope() as session:
    model = Model(**props)
    session.add(model)


def update_model(uuid, status):
  with session_scope() as session:
    model = session.query(Model).filter_by(uuid=uuid).first()
    if model is not None:
      model.status = int(status)
      return {'uuid': uuid, 'status': status}
    else:
      return {'uuid': uuid}


def delete_model(uuid):
  with session_scope() as session:
    model = session.query(Model).filter_by(uuid=uuid).first()
    if model is not None:
      session.delete(model)
      return {'uuid': uuid, 'type': model.type, 'name': model.name, 'version': model.version, 'label': model.label}
    else:
      return {'uuid': uuid}


def upload_model(type, name, label, filepath):
  uuid = uuid4()
  version = new_model_version()
  ensemble = 1 if name.startswith('ensemble') else 0

  filetype = f".{filepath.split('.')[-1]}"
  modelpath = model_path(name, version, file_ext=filetype)
  os.rename(filepath, modelpath)

  create_model(uuid=uuid, type=type, name=name, version=version, label=label, status=0, ensemble=ensemble)
  return {'uuid': uuid, 'type': type, 'name': name, 'version': version, 'label': label}

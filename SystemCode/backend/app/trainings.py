from uuid import uuid4
from datetime import datetime

from .entities import session_scope, Training


def get_trainings(type):
  with session_scope() as session:
    trs = session.query(Training).filter_by(model_type=type).order_by(Training.created_at).all()
    arr = []
    for m in trs:
      arr.append({
        'key': m.uuid,
        'uuid': m.uuid,
        'status': m.status,
        'created_at': None if m.created_at is None else m.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'begin_at': None if m.begin_at is None else m.begin_at.strftime('%Y-%m-%d %H:%M:%S'),
        'end_at': None if m.end_at is None else m.end_at.strftime('%Y-%m-%d %H:%M:%S'),
        'model_uuid': m.model_uuid,
        'model_name': m.model_name,
        'ensemble': m.ensemble,
        'base_models': m.base_models,
        'settings': m.settings,
        'datasets': m.datasets,
        'metrics': m.metrics
      })
    return arr


def create_training(**props):
  with session_scope() as session:
    model = Training(**props)
    session.add(model)


def update_training(uuid, status):
  with session_scope() as session:
    model = session.query(Training).filter_by(uuid=uuid).first()
    if model is not None:
      model.status = int(status)
      return {'uuid': uuid, 'status': status}
    else:
      return {'uuid': uuid}


def delete_training(uuid):
  with session_scope() as session:
    model = session.query(Training).filter_by(uuid=uuid).first()
    if model is not None:
      session.delete(model)
      return {'uuid': uuid}
    else:
      return {'uuid': uuid}


def add_training(ensemble, **props):
  uuid = uuid4()
  now = datetime.now()
  ensemble = 1 if ensemble else 0
  create_training(uuid=uuid, created_at=now, status=0, ensemble=ensemble, **props)
  return {'uuid': uuid}

import logging
import threading
import json
from uuid import uuid4
from datetime import datetime
from sqlalchemy import desc

from .entities import session_scope, Training
from .models import get_model, create_model, load, load_model, new_model_version, build_csv_logger, build_model_checkpoint
from .datasets import get_dataset, load_dataset
from .datasets.experiment import CLASS_NAMES
from .metrics import report, dataset_to_numpy


_logger = logging.getLogger(__name__)


def get_trainings(type):
  with session_scope() as session:
    trs = session.query(Training).filter_by(model_type=type).order_by(desc(Training.created_at)).all()
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


def update_training(uuid, status, begin = None, end = None, model_uuid = None, metrics = None):
  with session_scope() as session:
    model = session.query(Training).filter_by(uuid=uuid).first()
    if model is not None:
      model.status = int(status)
      if begin is not None:
        model.begin_at = begin
      if end is not None:
        model.end_at = end
      if model_uuid is not None:
        model.model_uuid = model_uuid
      if metrics is not None:
        model.metrics = metrics
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


def next_training():
  with session_scope() as session:
    m = session.query(Training).filter_by(status=0).order_by(Training.created_at).first()
    if m is not None:
      return m.uuid, m.model_type, m.model_name, m.ensemble, m.base_models, m.settings, m.datasets


_processing = False
def process_training():
  global _processing
  if(_processing):
    return {}
  x = threading.Thread(target=process_training_inner)
  x.start()
  return {}


def process_training_inner():
  global _processing
  if(_processing):
    return

  global _logger
  try:
    _processing = True
    _logger.debug("process begin")

    while True:
      trn = next_training()
      if trn is None:
        return
      (uuid, model_type, model_name, ensemble, base_models, settings, datasets) = trn
      try:
        update_training(uuid, status=1, begin=datetime.now())
        if model_type == 'detector':
          _logger.info("training detector model: %s", model_name)
          (model_uuid, metrics) = train_detector(model_name, ensemble, base_models, settings, datasets)
          update_training(uuid, status=2, end=datetime.now(), model_uuid=model_uuid, metrics=metrics)
        else:
          update_training(uuid, status=3, end=datetime.now())
      except Exception:
        _logger.exception(f"failed training: {uuid}")
        update_training(uuid, status=3, end=datetime.now())

  finally:
    _logger.debug("process end")
    _processing = False


def prepare_dataset(datasets, image_size, batch_size):
  datasets = json.loads(datasets)
  (uuid, name) = get_dataset(datasets['uuid'])
  return load_dataset(f"{name}_{uuid}", CLASS_NAMES, image_size=image_size, batch_size=batch_size)


def prepare_base_model(uuid):
  _, name, version = get_model(uuid)
  return load_model(name, version, use_cache=False)


def train_detector(model_name, ensemble, base_models, settings, datasets):
  settings = json.loads(settings)

  md = load(model_name)
  model_uuid = uuid4()
  model_version = new_model_version()

  (ds_trn, ds_val) = prepare_dataset(datasets, md.IMAGE_SIZE, settings["batch_size"])

  if ensemble == 1:
    bms = list(map(prepare_base_model, base_models.split(",")))
    model = md.build_model(classes=len(CLASS_NAMES), base_models=bms)
  else:
    model = md.build_model(classes=len(CLASS_NAMES))
  model.summary()

  callbacks = [
    build_csv_logger(md.MODEL_NAME, model_version),
    build_model_checkpoint(md.MODEL_NAME, model_version)
  ]
  model.fit(ds_trn, validation_data=ds_val, epochs=settings["max_epochs"], shuffle=True, callbacks=callbacks)

  (X, y) = dataset_to_numpy(ds_val)
  model_go = md.load_model(model_version)
  predicts = model_go.predict(X)
  metrics = report(y, predicts, CLASS_NAMES)

  create_model(uuid=model_uuid, type='detector', name=model_name, version=model_version, status=0, 
    label=f"Auto-trained ({model_name}: {'%.2f%%' % (metrics['acc_score']*100)})", ensemble=ensemble, base_models=base_models)

  return (model_uuid, json.dumps(metrics))

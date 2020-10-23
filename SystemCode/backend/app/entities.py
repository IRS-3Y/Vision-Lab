import os
from contextlib import contextmanager
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from . import context

def get_engine(**args):
  engine = context.get_obj('db_engine')
  if engine is None:
    host = os.getenv('DB_HOST', 'localhost')
    port = os.getenv('DB_PORT', '3306')
    username = os.getenv('DB_USERNAME', 'root')
    password = os.getenv('DB_PASSWORD', 'password1')
    engine = create_engine(f'mysql+mysqldb://{username}:{password}@{host}:{port}/vlab', **args)
    context.set_obj('db_engine', engine)
  return engine

Session = None
def get_session():
  global Session
  if Session is None:
    Session = sessionmaker(bind=get_engine())
  return Session()

@contextmanager
def session_scope():
  session = get_session()
  try:
    yield session
    session.commit()
  except:
    session.rollback()
    raise
  finally:
    session.close()


Base = declarative_base()

class Setting(Base):
  __tablename__ = 'settings'

  id = Column(Integer, primary_key=True)
  key = Column(String(255))
  value = Column(Text)

  def __repr__(self):
    return f"<Setting(key='{self.key}')>"

class Model(Base):
  __tablename__ = 'models'

  id = Column(Integer, primary_key=True)
  uuid = Column(String(36))
  type = Column(String(255))
  name = Column(String(255))
  version = Column(String(255))
  label = Column(String(255))
  status = Column(Integer)
  ensemble = Column(Integer)
  base_models = Column(String(255))

  def __repr__(self):
    return f"<Model(uuid='{self.uuid}')>"

class Image(Base):
  __tablename__ = 'images'

  id = Column(Integer, primary_key=True)
  uuid = Column(String(36))
  image_type = Column(String(10))
  model_name = Column(String(255))
  model_version = Column(String(255))
  likes = Column(Integer)
  downloads = Column(Integer)

  def __repr__(self):
    return f"<Image(uuid='{self.uuid}')>"


def set_setting(key, value):
  with session_scope() as session:
    entity = session.query(Setting).filter_by(key=key).first()
    if entity is None:
      session.add(Setting(key=key, value=value))
    else:
      entity.value = value


def get_setting(key, default_value = None):
  with session_scope() as session:
    entity = session.query(Setting).filter_by(key=key).first()
    if entity is None:
      return default_value
    else:
      return entity.value


def get_settings(keys = None):
  with session_scope() as session:
    entities = []
    if keys is None or len(keys) == 0:
      entities = session.query(Setting).all()
    else:
      entities = session.query(Setting).filter(Setting.key.in_(keys))

    settings = {}
    for s in entities:
      settings[s.key] = s.value
    return settings


_init = False
def init(debug = False):
  global _init
  if _init:
    return
  _init = True
  try:
    engine = get_engine(echo = debug)
    Base.metadata.create_all(engine)
  except:
    _init = False
    raise


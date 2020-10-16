from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from . import context

def get_engine(**args):
  engine = context.get_obj('db_engine')
  if engine is None:
    engine = create_engine('mysql+mysqldb://root:password1@localhost:3305/vlab', **args)
    context.set_obj('db_engine', engine)
  return engine

Session = None
def get_session():
  global Session
  if Session is None:
    Session = sessionmaker(bind=get_engine())
  return Session()


Base = declarative_base()

class Setting(Base):
  __tablename__ = 'settings'

  id = Column(Integer, primary_key=True)
  key = Column(String(255))
  value = Column(Text)

  def __repr__(self):
    return f"<Setting(key='{self.key}')>"

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


def set_setting(key, value, session = None):
  commit = False
  if session is None:
    session = get_session()
    commit = True
  
  entity = session.query(Setting).filter_by(key=key).first()
  if entity is None:
    session.add(Setting(key=key, value=value))
  else:
    entity.value = value
  
  if commit:
    session.commit()


def get_setting(key, default_value = None, session = None):
  if session is None:
    session = get_session()
  
  entity = session.query(Setting).filter_by(key=key).first()
  if entity is None:
    return default_value
  else:
    return entity.value


def get_settings(keys = None, session = None):
  if session is None:
    session = get_session()
  
  if keys is None or len(keys) == 0:
    return session.query(Setting).all()
  else:
    return session.query(Setting).filter(Setting.key.in_(keys))


_init = False
def init(debug = False):
  global _init
  if _init:
    return
  _init = True

  engine = get_engine(echo = debug)
  Base.metadata.create_all(engine)


import os

from .context import get_obj


def files_dir(*paths):
  '''
  Get file store directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'files', *paths)
  os.makedirs(path, exist_ok=True)
  return path


_uploads = {}
def upload_file(file_uuid, file_type):
  filename = f"{file_uuid}{file_type}"
  filepath = os.path.join(files_dir('upload'), filename)
  with open(filepath, 'wb'):
    pass
  _uploads[file_uuid] = filepath

def upload_file_chunk(file_uuid, offset, chunk):
  filepath = _uploads[file_uuid]
  with open(filepath, 'ab') as f:
    f.seek(int(offset))
    f.write(chunk)



import os
import sys

assert __name__ == 'setup_env'

dir_root = os.path.realpath('../..')

dir_work = os.path.join(dir_root, 'instance')

dir_temp = os.path.join(dir_work, 'temp')
os.makedirs(dir_temp, exist_ok=True)

# add app module to sys.path so that it's visible in notebook
if dir_root not in sys.path:
  sys.path.append(dir_root)

app = __import__('app')

# create simple app class to mock flask context
class MockApp:
  instance_path = dir_work

app.context.set_obj('app', MockApp())

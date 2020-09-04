'''
Global application context
'''

_context = {}


def get_obj(key = None):
  '''
  Get object from context
  '''
  if key is None:
    return _context
  else:
    return _context.get(key)


def set_obj(key, val):
  '''
  Set object in context
  '''
  old = _context.get(key)
  _context[key] = val
  return old


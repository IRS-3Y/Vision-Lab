import time


def retry(interval=1.0, timeout=60.0):
  def decorator(func):
    def wrapper(*args, **kwargs):
      start_time = time.perf_counter()
      while True:
        try:
          return func(*args, **kwargs)
        except Exception as ex:
          time.sleep(interval)
          if time.perf_counter() - start_time >= timeout:
            raise TimeoutError('Retry too many times') from ex
    return wrapper
  return decorator


'''
Backend Flask App
'''
from app import factory

app = factory.build()

if __name__ == '__main__':
  app.run(debug=True)

'''
Backend Flask App
'''
from app import factory, entities

app = factory.build()
entities.init(debug=False)

if __name__ == '__main__':
  app.run(debug=True)

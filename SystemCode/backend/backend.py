'''
Backend Flask App
'''
from app import factory, entities, utils

app = factory.build()

@utils.retry()
def setup_data():
  entities.init(debug=False)

setup_data()

if __name__ == '__main__':
  app.run(debug=True)

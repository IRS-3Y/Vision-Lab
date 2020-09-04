'''
Backend Flask App
'''
import app.factory

app = app.factory.build()

if __name__ == '__main__':
  app.run(debug=True)

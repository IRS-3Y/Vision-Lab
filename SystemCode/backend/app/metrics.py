from importlib import import_module
import numpy as np


def show_image(image):
  plt = import_module('matplotlib.pyplot')
  plt.imshow(image / 255, cmap = 'gray')


def dataset_to_numpy(dataset, limit = None):
  '''
  Extract from tensorflow dataset and put into numpy arrays
  '''
  xr = None
  yr = None
  cr = 0

  for (xt, yt) in dataset:
    x = xt.numpy()
    y = yt.numpy()
    c = y.shape[0]

    if limit is not None and cr + c > limit:
      return (xr, yr)
    elif yr is None:
      xr = x
      yr = y
    else:
      xr = np.concatenate((xr, x), axis=0)
      yr = np.concatenate((yr, y), axis=0)
      
    cr += c
  
  return (xr, yr)


def report(true_out, pred_out, class_names):
  metrics = import_module('sklearn.metrics')

  pred = np.argmax(pred_out, axis=1)
  test = np.argmax(true_out, axis=1)

  acc_score = metrics.accuracy_score(test, pred)
  cls_report = metrics.classification_report(test, pred, target_names=class_names, digits=4)

  print("Accuracy: %.2f%%" % (acc_score*100))
  print(cls_report)

  return {"acc_score": acc_score, "cls_report": cls_report}

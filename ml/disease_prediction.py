import numpy as np
from sklearn.naive_bayes import BernoulliNB
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import log_loss
import pandas as pd

class DiseaseClassifier(GridSearchCV):
    def __init__(self, df, label):
        X = df.drop([label], axis='columns').values
        y = df[label].values
        ss = StandardScaler(copy=True, with_mean=True, with_std=True)
        self.X = ss.fit_transform(X)
        self.y = y
        super().__init__(
            estimator = MLPClassifier(),
            param_grid = {
                    'max_iter': [10000],
                    'hidden_layer_sizes': [(30,30,30), (30), (30, 30), (250), (250,250,250), (100,100), (100)],
                    'activation': ['identity', 'logistic', 'tanh', 'relu'],
                    'learning_rate': ['constant', 'invscaling', 'adaptive']
                }
                )
        self.fit(self.X, self.y)




# X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.10)

def scaleData():
    ss = StandardScaler(copy=True, with_mean=True, with_std=True)
    ss.fit(X_train)
    X_train = ss.transform(X_train)
    X_test = ss.transform(X_test)

# def trainTestClassifier(scaled, layer_size):
#     clf = MLPClassifier(activation='relu', alpha=0.0001, batch_size='auto', beta_1=0.9,
#        beta_2=0.999, early_stopping=False, epsilon=1e-08,
#        hidden_layer_sizes=(30, 30, 30), learning_rate='constant',
#        learning_rate_init=0.001, max_iter=1000, momentum=0.9,
#        nesterovs_momentum=True, power_t=0.5, random_state=None,
#        shuffle=True, solver='adam', tol=0.0001, validation_fraction=0.1,
#        verbose=False, warm_start=False)
#     y_prob = clf.predict_proba(X_test)
#     loss = log_loss(y_test, y_prob)
#     possible_models[loss] = {'scaled':scaled, 'layer_size':layer_size}

def iqr(df, column):
    quant3 = df[column].quantile(0.75)
    quant1 = df[column].quantile(0.25)
    iqr = quant3 - quant1
    return df.loc[(df[column] > (quant3 + iqr*1.5)) |  (df[column] < (quant1 - iqr*1.5))].index

def selectBestModel(X, y, model):
    grid_search = GridSearchCV(
        estimator = model,
        param_grid = {
            'max_iter': [10000],
            'hidden_layer_sizes': [(30,30,30), (30), (30, 30), (250), (250,250,250), (100,100), (100)],
            'activation': ['identity', 'logistic', 'tanh', 'relu'],
            'learning_rate': ['constant', 'invscaling', 'adaptive']
        }
    )
    grid_search.fit(X, y)
    return grid_search.best_estimator_

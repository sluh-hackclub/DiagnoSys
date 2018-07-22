##imports
import numpy as np
from sklearn.naive_bayes import BernoulliNB
from sklearn.preprocessing import LabelEncoder
import pandas as pd

class SymptomClassifier(BernoulliNB):
    def __init__(self, initial_df, label):
        y = initial_df[label].values
        self.X = initial_df.drop([label], axis='columns').values
        self.diseasesLE = LabelEncoder()
        self.diseasesLE.fit(y)
        self.y = self.diseasesLE.transform(y)
        super().__init__()
        self.partial_fit(self.X, y, y)

    def update_classifier(self, updated_X, updated_y):
        self.partial_fit(updated_X, updated_y)
        return

    def new_label(self, new_df):
        self.__init__(new_df)
        return

    def predict(self, predict_X):
        predicted_probabilities = self.predict_proba(predict_X)
        top_four_index = np.argpartition(predicted_probabilities[0], -4)[-4:]
        top_four_predicted_diseases = self.diseasesLE.inverse_transform(top_four_index)
        return top_four_predicted_diseases


##initial data frame to partially train the model
# initialDf = pd.read_csv('cleaned_final_data.csv') - 'disease' field will be 'Unnamed: 0'


##new label encoder
# diseasesLE = LabelEncoder()
# diseasesLE.fit(y)
# y = diseasesLE.transform(y)
#
# ##create classifier
# diseaseClassifier = BernoulliNB()
#
# ##first fit of the classifier, specify classes
# diseaseClassifier.partial_fit(X, y, y)

##subsequent fits
# updated_X =
# updated_y =
# diseaseClassifier.partial_fit(updated_X, updated_y)
#
# ##new disease is added
# new_X =
# diseasesLE.fit(new_X)
# new_y = diseaseLE.transform(new_y)
# diseaseClassifier.fit(new_X, new_y, new_y)

##prediction
# predict_X =
# predicted_probabilities = diseaseClassifier.predict_proba(predict_X)
# top_four_index = np.argpartition(predicted_probabilities[0], -4)[-4:]
# top_four_predicted_diseases = diseasesLE.inverse_transform(top_four_index) ###send this data

##will provide form to enter test data

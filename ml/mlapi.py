from flask import Flask, render_template, flash, request, url_for, redirect, jsonify
from symptom_prediction import SymptomClassifier
from disease_prediction import DiseaseClassifier
import pandas as pd
import numpy as np

symptom_df = pd.read_csv('cleaned_final_data.csv').rename(columns={'Unnamed: 0': 'diseases'})
heart_disease_df = pd.read_csv('heart.csv')

app = Flask(__name__)

symptom_clf = SymptomClassifier(symptom_df, 'diseases')
disease_classifiers = {'heart_disease': DiseaseClassifier(heart_disease_df, 'target')}

posts = [{'smokes':'true', 'Number of Sexual Partners':'5'}]

@app.route('/symptoms', methods=['POST'])
def symptoms():
    data_symptoms = request.get_json()
    if data_symptoms != None:
        prediction_array = np.array([[data_symptoms[key] for key in data_symptoms]])
        prediction_list = symptom_clf.predict(prediction_array).tolist()
        return jsonify(diseases=prediction_list), 200
    else:
        return ('Data Not Received')

@app.route('/newcase', methods=['POST'])
def newcase():
    data_case = request.get_json()
    if len(data_case) >= 1:
        update_x = np.array([[data_case['diseases']]])
        ##the label has to be called diseases
        data_case.pop('diseases')
        update_y = np.array([[data_case[key] for key in data_case]])
        symptom_clf.update_classifier()
        return ('Classifier Updated'), 200
    else:
        return ('Data Not Received')

@app.route('/diseases/<disease>', methods=['POST'])
def diseases(disease):
    data_disease = request.get_json()
    disease_array = np.array([[data_disease[key] for key in data_disease]])
    prediction = disease_classifiers[disease].predict(disease_array)
    return jsonify(diagnosis=prediction), 200


if __name__ == '__main__':
    app.run(debug=True)

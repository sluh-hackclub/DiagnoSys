from flask import Flask, render_template, flash, request, url_for, redirect, jsonify
app = Flask(__name__)

posts = [{'smokes':'true', 'Number of Sexual Partners':'5'}]

@app.route('/symptoms', methods=['POST'])
def symptoms():
    data_symptoms = request.get_json()
    if data_symptoms != None:
        return ('Data Received'), 200
    else:
        return ('Data Not Received')

@app.route('/newcase', methods=['POST'])
def newcase():
    data_case = request.get_json()
    if len(data_case) >= 1:
        return ('Data Received'), 200
    else:
        return ('Data Not Received')
        
if __name__ == '__main__':
    app.run(debug=True)

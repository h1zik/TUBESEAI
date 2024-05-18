from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user-service:5000')
TOPUP_SERVICE_URL = os.getenv('TOPUP_SERVICE_URL', 'http://topup-service:5002')

@app.route('/register', methods=['POST'])
def register():
    try:
        response = requests.post(f'{USER_SERVICE_URL}/register', json=request.get_json())
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    response = requests.post(f'{USER_SERVICE_URL}/login', json=request.get_json())
    return jsonify(response.json()), response.status_code

@app.route('/user/<username>', methods=['GET'])
def get_user(username):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.get(f'{USER_SERVICE_URL}/user/{username}', headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/user/<username>', methods=['PUT'])
def update_user(username):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.put(f'{USER_SERVICE_URL}/user/{username}', json=request.get_json(), headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/user/<username>', methods=['DELETE'])
def delete_user(username):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.delete(f'{USER_SERVICE_URL}/user/{username}', headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/topup', methods=['POST'])
def topup():
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.post(f'{TOPUP_SERVICE_URL}/topup', json=request.get_json(), headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/transactions/<user_id>', methods=['GET'])
def transactions(user_id):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.get(f'{TOPUP_SERVICE_URL}/transactions/{user_id}', headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/transactions/<id>', methods=['PUT'])
def update_transaction(id):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.put(f'{TOPUP_SERVICE_URL}/transactions/{id}', json=request.get_json(), headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/transactions/<id>', methods=['DELETE'])
def delete_transaction(id):
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.delete(f'{TOPUP_SERVICE_URL}/transactions/{id}', headers=headers)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
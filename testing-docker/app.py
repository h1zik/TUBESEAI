from flask import Flask, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, resources={r"/*": {"origins": "*"}})

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get('MYSQL_HOST', 'mysql'),
        user=os.environ.get('MYSQL_USER', 'root'),
        password=os.environ.get('MYSQL_PASSWORD', 'root'),
        database=os.environ.get('MYSQL_DATABASE', 'user_service_db')
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token.split(" ")[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = generate_password_hash(data['password'])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password, account_balance) VALUES (%s, %s, %s)', (username, password, 0))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(message='User registered successfully'), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, password FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user[2], password):
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify(token=token)
    else:
        return jsonify(message='Invalid username or password'), 401

@app.route('/user/<username>', methods=['GET'])
@token_required
def get_user(current_user, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, account_balance FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify(id=user[0], username=user[1], account_balance=user[2])
    else:
        return jsonify(message='User not found'), 404

@app.route('/user/<username>', methods=['PUT'])
@token_required
def update_user(current_user, username):
    data = request.get_json()
    new_password = generate_password_hash(data['password'])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET password = %s WHERE username = %s', (new_password, username))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(message='User password updated successfully')

@app.route('/user/<username>', methods=['DELETE'])
@token_required
def delete_user(current_user, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE username = %s', (username,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(message='User deleted successfully')

@app.route('/update_balance', methods=['PUT'])
@token_required
def update_balance(current_user):
    data = request.get_json()
    amount = data['amount']

    # Log the received token
    token = request.headers.get('Authorization')
    print('Token received in user-service:', token)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET account_balance = account_balance + %s WHERE id = %s', (amount, current_user))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(message='User balance updated successfully')

if __name__ == '__main__':
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            account_balance DECIMAL(10, 2) DEFAULT 0.00
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()
    app.run(port=5001, host='0.0.0.0')
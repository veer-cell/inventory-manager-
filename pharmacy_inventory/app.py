import os
import sys
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import sqlite3
from config import Config

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.secret_key = 'pharmacy_inventory_secret_key'

# Database connection
def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

# Initialize database
def init_db():
    conn = get_db_connection()
    try:
        with app.open_resource('schema.sql', mode='r') as f:
            conn.cursor().executescript(f.read())
        conn.commit()
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        conn.close()

# Routes
@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db_connection()
        try:
            user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', 
                               (username, password)).fetchone()
            
            if user:
                session['username'] = username
                return redirect(url_for('dashboard'))
            else:
                return render_template('login.html', error='Invalid credentials')
        finally:
            conn.close()
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/inventory')
def inventory():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('inventory.html')

# API Routes
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    try:
        items = conn.execute('SELECT * FROM inventory ORDER BY name').fetchall()
        # Convert rows to dictionaries
        items_list = [dict(item) for item in items]
        return jsonify(items_list)
    finally:
        conn.close()

@app.route('/api/inventory', methods=['POST'])
def add_inventory_item():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (data['name'], data['description'], data['category'], data['quantity'], data['unit_price'], data['supplier'], data['expiry_date'])
        )
        conn.commit()
        return jsonify({'id': cursor.lastrowid, 'message': 'Item added successfully'})
    finally:
        conn.close()

@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    conn = get_db_connection()
    try:
        conn.execute(
            'UPDATE inventory SET name = ?, description = ?, category = ?, quantity = ?, unit_price = ?, supplier = ?, expiry_date = ? WHERE id = ?',
            (data['name'], data['description'], data['category'], data['quantity'], data['unit_price'], data['supplier'], data['expiry_date'], item_id)
        )
        conn.commit()
        return jsonify({'message': 'Item updated successfully'})
    finally:
        conn.close()

@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM inventory WHERE id = ?', (item_id,))
        conn.commit()
        return jsonify({'message': 'Item deleted successfully'})
    finally:
        conn.close()

if __name__ == '__main__':
    # Initialize the database
    init_db()
    app.run(debug=True, host='127.0.0.1', port=5000)
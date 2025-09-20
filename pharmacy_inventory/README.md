# Pharmacy Inventory Management System

A demo inventory management system for a pharmacy wholesale company with Flask backend and SQLite database.

## Project Overview

This is a complete inventory management system for a pharmacy wholesale company with the following features:
- User authentication (login/logout)
- Dashboard with inventory overview
- Full CRUD operations for inventory items
- Search and filter functionality
- Responsive web interface

## Project Structure

```
pharmacy_inventory/
├── app.py              # Flask application
├── config.py           # Database configuration
├── requirements.txt    # Python dependencies
├── schema.sql          # Database schema
├── pharmacy_inventory.db  # SQLite database (created automatically)
├── static/
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       └── main.js     # Frontend JavaScript
└── templates/
    ├── base.html       # Base template
    ├── login.html      # Login page
    ├── dashboard.html  # Dashboard page
    └── inventory.html  # Inventory management page
```

## Setup Instructions

### Prerequisites

- Python 3.6 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone or download the project** to your local machine

2. **Navigate to the project directory:**
   ```bash
   cd pharmacy_inventory
   ```

3. **Install the required Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Access the application:**
   Open your web browser and go to `http://127.0.0.1:5000`

## Usage

### Default User Credentials

- Username: `admin`, Password: `admin123`
- Username: `pharmacist`, Password: `pharma123`

### Features

1. **Login**: Use one of the default credentials to log in
2. **Dashboard**: View inventory overview and key metrics
3. **Inventory Management**: 
   - View all inventory items
   - Add new items
   - Edit existing items
   - Delete items
   - Search and filter items by name or category

### API Endpoints

- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add a new inventory item
- `PUT /api/inventory/<id>` - Update an existing inventory item
- `DELETE /api/inventory/<id>` - Delete an inventory item

## Development

### Database

The application uses SQLite for data storage. The database file `pharmacy_inventory.db` is automatically created when you first run the application.

### Modifying the Application

1. **Backend**: Modify `app.py` for Flask routes and logic
2. **Frontend**: Modify HTML templates in the `templates/` directory
3. **Styles**: Modify CSS in `static/css/style.css`
4. **JavaScript**: Modify `static/js/main.js` for frontend interactions

## Troubleshooting

1. **Port already in use**: If you get an error that port 5000 is already in use, you can change the port in `app.py`:
   ```python
   if __name__ == '__main__':
       init_db()
       app.run(debug=True, host='127.0.0.1', port=5001)  # Change to another port
   ```

2. **Database issues**: If you encounter database issues, you can delete the `pharmacy_inventory.db` file and restart the application to recreate it.
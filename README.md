💰 Expense Tracker
A full-stack expense tracking application built with Django REST Framework and React,featuring user authentication, transaction management, data visualization, and CSV export capabilities.

Live Demo:[ expense-tracker-kappa-mocha.vercel.app ](https://expense-tracker-kappa-mocha.vercel.app/login)| API:[ Backend](https://expense-tracker-api-nw3h.onrender.com)

🌟 Features
Core Functionality

✅ User Authentication - Secure JWT-based login and registration
✅ Transaction Management - Create, read, update, and delete transactions
✅ Income & Expense Tracking - Categorize transactions with multiple categories
✅ Real-time Balance - Automatic calculation of total income, expenses, and balance

Advanced Features

🔍 Smart Search - Search transactions by category or description
🎛️ Advanced Filters - Collapsible filter panel with type, category, and date range filters
📊 Data Visualization - Interactive pie chart showing expense vs income (Recharts)
📥 CSV Export - Export filtered transactions to CSV format
🌓 Dark Mode - Seamless toggle between light and dark themes
📱 Responsive Design - Mobile-first design that works on all devices
♾️ Infinite Scroll - Smooth pagination with automatic loading
🎨 Smooth Animations - Framer Motion powered animations throughout
💾 Persistent Storage - PostgreSQL database with automatic backups


🛠️ Tech Stack
Backend

Django 5.2 - Python web framework
Django REST Framework - RESTful API toolkit
Simple JWT - JWT authentication for secure API access
PostgreSQL - Production database (Render)
SQLite - Development database
WhiteNoise - Static file serving
Gunicorn - WSGI HTTP server for production

Frontend

React 18 - JavaScript library for building user interfaces
Vite - Next-generation frontend build tool
Tailwind CSS 4 - Utility-first CSS framework
Framer Motion - Production-ready animation library
Lucide React - Beautiful & consistent icon library
Recharts - Composable charting library
Axios - Promise-based HTTP client

Deployment

Frontend: Vercel (Automatic deployments from GitHub)
Backend: Render (PostgreSQL + Web Service)


📋 Prerequisites

Python 3.11+
Node.js 18+
Git
PostgreSQL (for production)

🚀 Local Setup
Backend Setup

Clone the repository

bash   git clone https://github.com/JayKadi/expense-tracker.git
   cd expense-tracker/backend

Create and activate virtual environment

bash   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate

Install dependencies

bash   pip install -r requirements.txt

Run migrations

bash   python manage.py makemigrations
   python manage.py migrate

Create superuser (optional)

bash   python manage.py createsuperuser

Run development server

bash   python manage.py runserver
Backend will be available at http://localhost:8000
Frontend Setup

Navigate to frontend directory

bash   cd ../frontend

Install dependencies

bash   npm install

Create environment file

bash   # Windows
   echo VITE_API_URL=http://localhost:8000/api > .env

   # Mac/Linux
   echo "VITE_API_URL=http://localhost:8000/api" > .env

Run development server

bash   npm run dev
Frontend will be available at http://localhost:5173

📱 Usage Guide
1. Register/Login

Visit the application
Click "Register" to create a new account
Fill in username, email, and password
Or "Login" with existing credentials

2. Add Transactions

Click the + floating action button (bottom-right)
Fill in transaction details:

Type: Income or Expense
Category: Select from predefined categories
Amount: Enter transaction amount
Date: Choose transaction date
Description: Optional details


Click "Add Transaction"

3. View Dashboard

Summary Cards: View total income, expenses, and balance
Transaction List: See all transactions with infinite scroll
Pie Chart: Visual breakdown of expenses by category

4. Search & Filter

Search Bar: Type to search by category or description
Filters Button: Click to expand advanced filters

Filter by type (Income/Expense)
Filter by category
Filter by date range (start and end dates)


Clear Button: Reset all active filters

5. Export Data

Apply filters (optional) to narrow down data
Click "Export CSV" button (green)
CSV file downloads with filtered transactions
Open in Excel, Google Sheets, or any spreadsheet app

6. Edit/Delete Transactions

Click Edit icon on any transaction to modify
Click Delete icon to remove (with confirmation)

7. Dark Mode

Toggle dark mode using the sun/moon icon (top-right)
Preference is saved locally

8. Logout

Click the logout icon (top-right) to sign out
Redirects to login page
needed


🐛 Known Issues & Future Improvements
Current Limitations

⏰ Backend sleeps after 15 minutes of inactivity (Render free tier)
📊 Chart only shows expenses vs income(categories specific coming soon)
🌐 No offline support yet

Planned Features

 Budget setting and tracking
 Recurring transactions
 Multiple currency support
 Email notifications
 
<div align="center">
Made with ❤️ using Django and React
⭐ Star this repo if you find it helpful!
</div>

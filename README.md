# 💰 Expense Tracker

A full-stack expense tracking application built with Django REST Framework and React, featuring user authentication, transaction management, data visualization, and CSV export capabilities.

## 🚀 Live Demo

**Frontend:** [https://expense-tracker-kappa-mocha.vercel.app](https://expense-tracker-kappa-mocha.vercel.app)  
**Backend API:** [https://expense-tracker-production-8118.up.railway.app](https://expense-tracker-production-8118.up.railway.app)

## 🌟 Features

### Core Functionality
✅ User Authentication - Secure JWT-based login and registration  
✅ Google OAuth Login - Quick sign-in with Google account  
✅ Transaction Management - Create, read, update, and delete transactions  
✅ Income & Expense Tracking - Categorize transactions with multiple categories  
✅ Real-time Balance - Automatic calculation of total income, expenses, and balance  

### Advanced Features
🔍 Smart Search - Search transactions by category or description  
🎛️ Advanced Filters - Collapsible filter panel with type, category, and date range filters  
📊 Data Visualization - Interactive pie chart showing expense vs income (Recharts)  
📥 CSV Export - Export filtered transactions to CSV format  
🌓 Dark Mode - Seamless toggle between light and dark themes  
📱 Responsive Design - Mobile-first design that works on all devices  
♾️ Infinite Scroll - Smooth pagination with automatic loading  
🎨 Smooth Animations - Framer Motion powered animations throughout  
💾 Persistent Storage - PostgreSQL database with automatic backups  

## 🏗️ Deployment

**Frontend:** Vercel  
**Backend:** Railway  
**Database:** PostgreSQL (Railway)

## 🛠️ Tech Stack

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - RESTful API toolkit
- **Simple JWT** - JWT authentication for secure API access
- **Google OAuth2** - Google authentication integration
- **PostgreSQL** - Production database (Railway)
- **SQLite** - Development database
- **WhiteNoise** - Static file serving
- **Gunicorn** - WSGI HTTP server for production

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **Material-UI Icons** - Icon library
- **Lucide React** - Beautiful & consistent icon library
- **Recharts** - Composable charting library
- **Axios** - Promise-based HTTP client
- **React Router** - Declarative routing

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- PostgreSQL (for production)

## 🚀 Local Setup

### Backend Setup

1. **Clone the repository**
```bash
   git clone https://github.com/JayKadi/expense-tracker.git
   cd expense-tracker/backend
```

2. **Create and activate virtual environment**
```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
```

3. **Install dependencies**
```bash
   pip install -r requirements.txt
```

4. **Create `.env` file in backend directory**
```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DATABASE_URL=sqlite:///db.sqlite3
   GOOGLE_CLIENT_ID=your-google-client-id
```

5. **Run migrations**
```bash
   python manage.py makemigrations
   python manage.py migrate
```

6. **Create superuser (optional)**
```bash
   python manage.py createsuperuser
```

7. **Run development server**
```bash
   python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
   cd ../frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Create `.env` file in frontend directory**
```env
   VITE_API_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

4. **Run development server**
```bash
   npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📱 Usage Guide

### 1. Register/Login
- Visit the application
- Click "Register" to create a new account
- Fill in username, email, and password
- Or use "Sign in with Google" for quick access
- Or "Login" with existing credentials

### 2. Add Transactions
- Click the **+** floating action button (bottom-right)
- Fill in transaction details:
  - **Type:** Income or Expense
  - **Category:** Select from predefined categories
  - **Amount:** Enter transaction amount
  - **Date:** Choose transaction date
  - **Description:** Optional details
- Click "Add Transaction"

### 3. View Dashboard
- **Summary Cards:** View total income, expenses, and balance
- **Transaction List:** See all transactions with infinite scroll
- **Pie Chart:** Visual breakdown of expenses by category

### 4. Search & Filter
- **Search Bar:** Type to search by category or description
- **Filters Button:** Click to expand advanced filters
  - Filter by type (Income/Expense)
  - Filter by category
  - Filter by date range (start and end dates)
- **Clear Button:** Reset all active filters

### 5. Export Data
- Apply filters (optional) to narrow down data
- Click "Export CSV" button (green)
- CSV file downloads with filtered transactions
- Open in Excel, Google Sheets, or any spreadsheet app

### 6. Edit/Delete Transactions
- Click **Edit** icon on any transaction to modify
- Click **Delete** icon to remove (with confirmation)

### 7. Dark Mode
- Toggle dark mode using the sun/moon icon (top-right)
- Preference is saved locally

### 8. Logout
- Click the logout icon (top-right) to sign out
- Redirects to login page

## 🔐 Environment Variables

### Backend (Railway)
```env
SECRET_KEY=your-django-secret-key
DEBUG=False
DATABASE_URL=postgresql://... (auto-populated by Railway)
GOOGLE_CLIENT_ID=your-google-client-id
```

### Frontend (Vercel)
```env
VITE_API_URL=https://expense-tracker-production-8118.up.railway.app
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🐛 Known Issues & Future Improvements

### Current Limitations
- 📊 Chart only shows expenses vs income (category-specific breakdown coming soon)
- 🌐 No offline support yet

### Planned Features
- ⏱️ Budget setting and tracking
- 🔄 Recurring transactions
- 📧 Email notifications for large expenses
- 📈 Advanced analytics and insights
- 🏷️ Custom category creation
- 💱 Multi-currency support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Jay Kadi**  
- GitHub: [@JayKadi](https://github.com/JayKadi)

## 🙏 Acknowledgments

- Django REST Framework team
- React and Vite communities
- Vercel and Railway for hosting
- All open-source contributors

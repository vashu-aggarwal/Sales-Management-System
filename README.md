# Retail Sales Management System — TruEstate SDE Intern Assignment

## 📌 Overview
This project is a full-stack Retail Sales Management System developed as part of the TruEstate SDE Intern assignment.  
It enables efficient handling of structured sales data with **full-text search, multi-select filtering, sorting, and pagination**, providing a professional and scalable user experience aligned with industry engineering practices.

---

## 🛠 Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Deployment | Backend - Render • Database - Railway • Frontend - Vercel |
| Others | REST APIs, CORS, Environment Variables |

---

## 🔍 Search Implementation Summary
- Full-text search implemented across **Customer Name** and **Phone Number**
- Search is **case-insensitive**, **accurate**, and **optimized**
- Works seamlessly alongside active filters, sorting, and pagination

---

## 🎯 Filter Implementation Summary
Multi-select and range filters for:
- Customer Region
- Gender
- Age Range
- Product Category
- Tags
- Payment Method
- Date Range

Filters:
- Work independently and in combination
- Maintain UI state across pagination and sorting
- Handle conflicting and zero-result states gracefully

---

## ↕ Sorting Implementation Summary
Sorting options implemented on:
- Date (Newest First)
- Quantity
- Customer Name (A–Z)

Sorting:
- Preserves active search and filter conditions
- Updates results instantly without reloading the page

---

## 📄 Pagination Implementation Summary
- Page size: **10 records per page**
- Supports **Next / Previous** navigation
- Retains search, filters, and sorting selections across pages

---

## Folder Structure

```
Retail Sales Management System/
├── backend/                          # Backend application root
│   ├── package.json                  # Backend dependencies
│   └── src/
│       ├── index.js                  # Server entry point
│       ├── controllers/              # Business logic layer
│       │   ├── filterController.js   # Filtering logic
│       │   ├── searchController.js   # Search logic
│       │   ├── sortController.js     # Sorting logic
│       │   └── transactionController.js  # Transaction CRUD
│       ├── routes/
│       │   └── transactions.js       # API endpoints
│       └── utils/                    # Utility layer
│           ├── db.js                 # Database connection
│           └── queryHelper.js        # Query building
├── frontend/                         # Frontend application root
│   ├── package.json                  # Frontend dependencies
│   ├── index.html                    # HTML template
│   ├── main.jsx                      # React entry point
│   ├── App.jsx                       # Root component
│   ├── index.css                     # Global styles
│   ├── vite.config.js                # Vite configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── eslint.config.js              # ESLint configuration
│   ├── public/                       # Static assets
│   └── src/
│       ├── components/               # Reusable UI components
│       │   ├── FilterDropdown.jsx    # Filter dropdown
│       │   ├── FilterModal.jsx       # Advanced filter modal
│       │   ├── FiltersPanel.jsx      # Filter container
│       │   ├── Pagination.jsx        # Pagination controls
│       │   ├── Sidebar.jsx           # Navigation sidebar
│       │   ├── SummaryCard.jsx       # Summary display
│       │   ├── Topbar.jsx            # Header/topbar
│       │   └── TransactionsTable.jsx # Transaction table
│       ├── pages/                    # Page components
│       │   └── Dashboard.jsx         # Main dashboard page
│       └── utils/                    # Utility functions
│           └── dataUtils.js          # Data helpers & API calls
└── docs/
    └── architecture.md               # This file
```

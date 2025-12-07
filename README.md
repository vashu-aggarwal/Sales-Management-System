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
| Database | PostgreSQL |
| Deployment | Backend - Render • Database - Railway • Frontend - Render |
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

## 🚀 Setup Instructions

### 🔧 Backend Setup
```sh
cd backend
npm install
npm start

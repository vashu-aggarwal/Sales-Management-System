# Retail Sales Management System - Architecture Documentation

## Overview

The Retail Sales Management System is a full-stack web application built with Node.js/Express backend and React/Vite frontend. It provides transaction management, filtering, searching, and sorting capabilities for retail sales data.

---

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Port**: 5000 (default)

### Architecture Pattern

The backend follows a **layered architecture** with clear separation of concerns:

- **Routes Layer**: Handles HTTP endpoints
- **Controller Layer**: Processes requests and calls services
- **Utility Layer**: Contains database helpers and query builders
- **Database Layer**: Direct database operations

### Key Components

#### Routes (`/backend/src/routes/`)

- **transactions.js**: Defines all transaction-related API endpoints
  - GET endpoints for retrieving transactions with filters
  - POST/PUT/DELETE endpoints for transaction management

#### Controllers (`/backend/src/controllers/`)

- **transactionController.js**: Manages transaction business logic

  - Handles CRUD operations on transactions
  - Coordinates with database utilities

- **filterController.js**: Manages filtering logic

  - Processes filter parameters
  - Applies filters to queries

- **searchController.js**: Manages search functionality

  - Implements search logic across transaction fields
  - Handles search term parsing

- **sortController.js**: Manages sorting logic
  - Applies sort criteria to queries
  - Handles ascending/descending order

#### Utilities (`/backend/src/utils/`)

- **db.js**: Database connection management

  - Establishes MySQL connection
  - Handles connection pooling
  - Provides connection wrapper for queries

- **queryHelper.js**: Query building utilities
  - Constructs dynamic SQL queries
  - Handles parameter binding
  - Supports filtering, searching, and sorting

#### Entry Point

- **index.js**: Server initialization
  - Configures Express middleware
  - Registers routes
  - Starts server on configured port

---

## Frontend Architecture

### Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS Modules / PostCSS
- **State Management**: React Hooks (useState, useContext)
- **HTTP Client**: Fetch API

### Architecture Pattern

The frontend follows a **component-based architecture** with clear separation:

- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Utils**: Helper functions and API calls
- **Styles**: CSS modules for styling

### Key Components

#### Pages (`/frontend/src/pages/`)

- **Dashboard.jsx**: Main application page
  - Orchestrates all major components
  - Manages global state (transactions, filters)
  - Handles data fetching and updates

#### Components (`/frontend/src/components/`)

- **TransactionsTable.jsx**: Displays transaction data

  - Renders transaction list in table format
  - Supports pagination
  - Shows transaction details

- **FiltersPanel.jsx**: Main filter interface container

  - Manages filter state
  - Coordinates filter-related components

- **FilterModal.jsx**: Modal for advanced filtering

  - Allows detailed filter configuration
  - Applies multiple filter conditions

- **FilterDropdown.jsx**: Dropdown filter selector

  - Quick filter selection
  - Single/multi-select filtering

- **Topbar.jsx**: Application header

  - Displays title and branding
  - Contains global actions

- **Sidebar.jsx**: Navigation and quick access

  - Application navigation
  - Quick filters or information panel

- **Pagination.jsx**: Pagination controls

  - Navigate between transaction pages
  - Control page size

- **SummaryCard.jsx**: Summary statistics display
  - Shows key metrics
  - Transaction counts, totals, etc.

#### Utilities (`/frontend/src/utils/`)

- **dataUtils.js**: Data manipulation and API helpers
  - Formats data for display
  - Parses API responses
  - Implements sorting and filtering logic

#### Styling

- **index.css**: Global styles
- **postcss.config.js**: PostCSS configuration
- **eslint.config.js**: ESLint configuration

#### Entry Points

- **main.jsx**: React application entry
- **index.html**: HTML template
- **App.jsx**: Root React component

---

## Data Flow

### Request/Response Flow

```
Frontend UI User Action
    ↓
React Component State Update
    ↓
API Request to Backend (Fetch)
    ↓
Express Route Handler
    ↓
Controller (Business Logic)
    ↓
queryHelper (Query Building)
    ↓
Database Connection (db.js)
    ↓
MySQL Database
    ↓
Query Result
    ↓
Controller Response Formatting
    ↓
JSON Response to Frontend
    ↓
React State Update
    ↓
Component Re-render
    ↓
Updated UI Display
```

### Specific Data Flows

#### Transaction Retrieval

1. User loads Dashboard or triggers page load
2. Dashboard component calls API endpoint
3. Backend route receives request with optional filters/search/sort params
4. Controller coordinates between filter, search, sort controllers
5. queryHelper builds dynamic SQL query with all conditions
6. Database connection executes query
7. Results returned as JSON array
8. Frontend updates transaction state
9. TransactionsTable component renders results

#### Filtering

1. User selects filter criteria in FilterDropdown or FilterModal
2. Frontend state updates with filter values
3. API request sent with filter parameters
4. filterController processes filter conditions
5. queryHelper applies WHERE clauses to query
6. Database returns filtered results
7. Frontend displays filtered transactions

#### Search

1. User enters search term in search input
2. Frontend state updates with search term
3. API request sent with search parameter
4. searchController processes search term
5. queryHelper builds query searching relevant fields
6. Database returns matching results
7. Frontend displays search results

#### Sorting

1. User clicks column header to sort
2. Frontend updates sort state (field, direction)
3. API request sent with sort parameters
4. sortController processes sort criteria
5. queryHelper applies ORDER BY clause
6. Database returns sorted results
7. Frontend displays sorted transactions

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

---

## Module Responsibilities

### Backend Modules

#### `index.js` (Server Entry Point)

**Responsibilities:**

- Initialize Express application
- Configure middleware (JSON parser, CORS, etc.)
- Register all routes
- Start HTTP server
- Handle server startup/shutdown events

#### `transactionController.js`

**Responsibilities:**

- Handle transaction CRUD operations (Create, Read, Update, Delete)
- Validate transaction data
- Format transaction responses
- Coordinate with database utilities
- Return appropriate HTTP status codes

#### `filterController.js`

**Responsibilities:**

- Parse filter parameters from requests
- Validate filter criteria
- Build filter condition objects
- Coordinate with queryHelper for SQL generation
- Handle multiple simultaneous filters

#### `searchController.js`

**Responsibilities:**

- Parse search terms from requests
- Determine searchable fields
- Build search query conditions
- Handle partial string matching
- Support case-insensitive search

#### `sortController.js`

**Responsibilities:**

- Parse sort parameters (field, direction)
- Validate sortable fields
- Build sort SQL clauses
- Handle ascending/descending order
- Provide default sort options

#### `db.js` (Database Connection)

**Responsibilities:**

- Establish connection to MySQL database
- Manage connection pool
- Provide query execution interface
- Handle connection errors and reconnection
- Close connections gracefully

#### `queryHelper.js` (Query Builder)

**Responsibilities:**

- Build dynamic SQL queries
- Apply WHERE clauses for filters
- Apply JOIN clauses if needed
- Apply ORDER BY clauses for sorting
- Handle parameter binding and escaping
- Construct SELECT, INSERT, UPDATE, DELETE queries

#### `transactions.js` (Routes)

**Responsibilities:**

- Define API route paths
- Map routes to controllers
- Validate request parameters
- Handle HTTP method routing
- Return appropriate response codes

### Frontend Modules

#### `main.jsx` (React Entry Point)

**Responsibilities:**

- Initialize React application
- Mount root component to DOM
- Set up application-wide providers
- Handle application initialization

#### `App.jsx` (Root Component)

**Responsibilities:**

- Define application layout structure
- Route between pages
- Provide global context/state if needed
- Render page components

#### `Dashboard.jsx` (Main Page)

**Responsibilities:**

- Fetch transaction data from backend
- Manage transaction list state
- Handle filter/search/sort state
- Coordinate child components
- Pass data and callbacks to components
- Handle pagination state

#### `TransactionsTable.jsx`

**Responsibilities:**

- Display transaction data in table format
- Format data for display
- Handle row selection/actions
- Support sorting by column click
- Display loading/error states
- Emit events for user interactions

#### `FiltersPanel.jsx`

**Responsibilities:**

- Provide filter interface to user
- Collect filter selections
- Coordinate FilterDropdown and FilterModal
- Pass filter state to parent
- Display active filters
- Allow clearing filters

#### `FilterModal.jsx`

**Responsibilities:**

- Provide advanced filtering options
- Collect complex filter criteria
- Validate filter input
- Return selected filters to parent
- Display modal UI/UX

#### `FilterDropdown.jsx`

**Responsibilities:**

- Display dropdown filter options
- Handle filter selection
- Support single/multi-select
- Emit filter change events
- Display selected filter values

#### `Pagination.jsx`

**Responsibilities:**

- Display pagination controls
- Handle page navigation
- Support page size selection
- Display current page info
- Emit pagination events

#### `Topbar.jsx`

**Responsibilities:**

- Display application header
- Show application title/branding
- Display global actions/buttons
- Show user info if applicable

#### `Sidebar.jsx`

**Responsibilities:**

- Provide navigation menu
- Display quick filters or options
- Handle navigation between sections
- Show sidebar state/info

#### `SummaryCard.jsx`

**Responsibilities:**

- Display transaction summary statistics
- Show key metrics (count, total, average, etc.)
- Format numeric data
- Display visual indicators

#### `dataUtils.js`

**Responsibilities:**

- Format data for display (dates, currency, etc.)
- Parse API responses
- Transform data for tables/charts
- Implement local sorting/filtering if needed
- Handle data validation
- Provide API endpoint URLs
- Execute fetch calls to backend

#### `index.css` (Global Styles)

**Responsibilities:**

- Define global CSS variables
- Set base element styles
- Define utility classes
- Reset browser defaults
- Set theme colors/fonts

---

## Communication Patterns

### Backend-Frontend Communication

- **Protocol**: HTTP/REST
- **Data Format**: JSON
- **Request Method**: GET (retrieval), POST (creation), PUT (updates), DELETE (deletion)
- **Response Status**: Standard HTTP status codes (200, 201, 400, 404, 500, etc.)

### Error Handling

- Backend returns error objects with status and message
- Frontend displays errors to user
- Both layers implement input validation

---

## Technology Decisions

### Database: MySQL

- Structured relational data
- ACID transactions support
- Good performance for transactional data
- Mature and widely supported

### Frontend: React + Vite

- Component reusability
- Fast development with Vite
- Efficient virtual DOM rendering
- Large ecosystem of libraries

### Backend: Node.js + Express

- JavaScript across full stack
- Non-blocking I/O for concurrent requests
- Lightweight and flexible framework
- Good middleware ecosystem

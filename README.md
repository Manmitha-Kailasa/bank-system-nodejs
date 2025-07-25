# bank-system-nodejs
Node.js + Express + SQLite REST API for Bank Loan Management System


# Bank System API (Node.js + Express + SQLite)

## ✅ Features
- LEND: Create a loan
- PAYMENT: Pay EMI or lump sum
- LEDGER: View transactions for a loan
- ACCOUNT OVERVIEW: All loans of a customer

## ✅ Setup
```bash
npm init -y
npm install express body-parser sqlite3
node server.js
```
Server runs at **http://localhost:3000**

### API Endpoints
1. **POST** `/api/lend`
2. **POST** `/api/payment/:loanId`
3. **GET** `/api/ledger/:loanId`
4. **GET** `/api/overview/:customerId`

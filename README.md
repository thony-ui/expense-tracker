# 💸 Expense Tracker – Just Track It.

**Easy, fast, and smart expense tracking. No budgets. No noise. Just clarity.**

This app is built with a single goal: **help you know exactly how much you spend**, in the most efficient and accurate way possible.

---

## ✨ Features

- 🧾 **Auto-generated Expense Reports**  
  Get clear summaries of your spending — monthly, category-wise, or daily.

- 🌍 **Live Currency Conversion (Every 3 Hours)**  
  Automatically converts foreign transactions based on up-to-date exchange rates.

- 🧠 **LLM-Powered Summaries**  
  Use AI to summarize spending behavior or extract key takeaways from your expenses.

- 📤 **Google Sheets Sync**  
  Automatically logs your transactions into Google Sheets — for backups, audits, or deeper analysis.

---

## 🧠 Product Philosophy

> “Do one thing, and do it really well.”

This isn’t a budgeting app. It’s not trying to predict your future or micromanage your finances.  
This is a **clean and intelligent tracker** — built to answer one question:

> **Where did my money go?**

That’s it. And that’s enough.

---

## 🚀 Installation

Follow the steps below to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/thony-ui/expense-tracker.git
cd expense-tracker
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Set Up Environment Variables

Create `.env` files in both the `frontend` and `backend` directories.  
These should include:

```env
# Example backend .env
SECRET_KEY=""
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
ALLOWED_ORIGIN_PRODUCTION=""
ALLOWED_ORIGIN_DEVELOPMENT=""
PORT=8000
LOG_LEVEL=debug
OPENROUTER_API_KEY=""
OPENROUTER_URL=""


SPREADSHEET_ID=""
GOOGLE_CLIENT_EMAIL=""
GOOGLE_PRIVATE_KEY=""

```

```env
# Example frontend .env
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_API_URL=""
NEXT_PUBLIC_SITE_URL=""
# Add any frontend-specific public vars
```

Make sure not to commit your `.env` files to version control.

---

## 📄 License

MIT License

---

## 🤝 Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# Campus Marketplace

A web app built for COMP2750 at Macquarie University. Students can sign in, browse items listed by other students, manage their own listings, and save items to a shortlist.

---

## Pages

| Page | File | What it does |
|---|---|---|
| Login | `login.html` | Firebase email/password sign-in |
| Welcome | `index.html` | Landing page with navigation cards |
| Marketplace | `marketplace.html` | Browse items from other students |
| My Listings | `mylistings.html` | View your own listed items |
| Shortlist | `shortlist.html` | Saved items you're interested in |

---

## Stack

- HTML, CSS, Bootstrap 5
- Vanilla JavaScript (ES Modules)
- Firebase Authentication
- Cloud Firestore

---

## Project Structure

```
campus-marketplace/
├── index.html
├── login.html
├── marketplace.html
├── mylistings.html
├── shortlist.html
├── css/
│   └── styles.css
├── js/
│   ├── firebase-config.js   ← Firebase init
│   ├── auth.js              ← Auth guard + sign out
│   ├── login.js
│   ├── index.js
│   ├── marketplace.js
│   ├── mylistings.js
│   └── shortlist.js
└── images/
```

---

## Running Locally

Clone the repo and open with Live Server in VS Code. Direct `file://` won't work - ES Modules require a local server.

```bash
git clone https://github.com/RumitMaharjan/campus-marketplace.git
cd campus-marketplace
# Open in VS Code → right click index.html → Open with Live Server
```

---

## Test Accounts

| Email | Password |
|---|---|
| alice@students.mq.edu.au | Password123! |
| bob@students.mq.edu.au | Password123@ |
| carol@students.mq.edu.au | Password123 |

---

## Firebase Config

```js
apiKey: "AIzaSyBlYQOgm3vaV6cf9S9r7NnuvSMpZQ6hstU"
authDomain: "campus-marketplace-9b763.firebaseapp.com"
projectId: "campus-marketplace-9b763"
storageBucket: "campus-marketplace-9b763.firebasestorage.app"
messagingSenderId: "563778257349"
appId: "1:563778257349:web:8f2d822301e05262438bac"
```

---

*COMP2750 Assignment 3 - Macquarie University, 2026*

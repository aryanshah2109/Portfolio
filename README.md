# Aryan Shah Portfolio

Static HTML, CSS, and JavaScript portfolio with email-enabled contact form support.

## Project structure

```text
Portfolio/
  api/
    contact.mjs
  assets/
  index.html
  style.css
  script.js
  server.js
  package.json
  vercel.json
  .env.example
```

## Local run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and add SMTP credentials.

3. Start the local Node server:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000`.

## Vercel deployment

Vercel serves the static files and runs `api/contact.mjs` as the `/api/contact` serverless function.

Add these environment variables in Vercel:

```env
CONTACT_RECEIVER=aryanrshah2109@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=aryanrshah2109@gmail.com
SMTP_PASS=your-gmail-app-password
```

## Gmail setup

Use a Gmail App Password, not your regular account password:

- Enable 2-Step Verification on the Google account.
- Create an App Password for Mail.
- Put that generated password in `SMTP_PASS`.

The backend sends contact form messages to `aryanrshah2109@gmail.com`.

# Aryan Shah Portfolio

Static HTML, CSS, and JavaScript portfolio with a small Node.js backend for the contact form.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and add SMTP credentials.

3. Start the server:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000`.

## Gmail setup

Use a Gmail App Password, not your regular account password:

- Enable 2-Step Verification on the Google account.
- Create an App Password for Mail.
- Put that generated password in `SMTP_PASS`.

The backend sends contact form messages to `aryanrshah2109@gmail.com`.

# MongoDB Users Assignment

This standalone backend connects to MongoDB, creates the `users` collection,
and provides endpoints to add and fetch users.

## Run

1. Copy `.env.example` to `.env`.
2. Set `MONGODBURI` to your MongoDB connection string.
3. From this folder, run `npm install`, then `npm start`.

The server listens on port `5001` by default. Change `PORT` in `.env` to use
a different port.

## Endpoints

- `GET /users` — fetch all users, newest first.
- `POST /users` — create a user with JSON fields `name` and `email`.

The app creates the MongoDB `users` collection at startup. No user records are
inserted automatically.

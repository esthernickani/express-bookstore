/** Common config for bookstore. */
require('dotenv').config()

let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}esther:${process.env.DB_PASSWORD}@localhost:5432/books-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}esther:${process.env.DB_PASSWORD}@localhost:5432/books`;
}

module.exports = { DB_URI };
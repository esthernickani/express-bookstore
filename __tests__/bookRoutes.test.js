process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app")
const Test = require("supertest/lib/test");
const db = require("../db")
const Book = require("../models/book")

describe("Test Books class and routes", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books");

        let book1 = await Book.create({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking Hidden Math in Video Games",
                "year": 2017
            }  
        });
    })

    test("Get all books", async function() {
        const resp = await request(app).get(`/books`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual(
            {"books": [{
                        "isbn": "0691161518",
                        "amazon_url": "http://a.co/eobPtX2",
                        "author": "Matthew Lane",
                        "language": "english",
                        "pages": 264,
                        "publisher": "Princeton University Press",
                        "title": "Power-Up: Unlocking Hidden Math in Video Games",
                        "year": 2017
                    }  
                ]}
            );
        });

    test("can create a book", async function() {
        let book = await Book.create({
            "book": {
                "isbn": "1234567889",                
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Timothy Kim",
                "language": "english",
                "pages": 100,
                "publisher": "University of Alberta",
                "title": "Finding food",
                "year": 2020
            }  
        })

        expect(book.isbn).toEqual("1234567889")
        expect(book.author).toEqual("Timothy Kim")
    })

    test("Updates a single book", async function() {
        const resp = await request(app)
          .put(`/books/0691161518`)
          .send({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Linx",
                "language": "english",
                "pages": 145,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking Hidden Math in Video Games",
                "year": 2017
            }  
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "book": {
                "isbn": expect.any(String),
                "amazon_url": expect.any(String),
                "author": "Matthew Linx",
                "language": expect.any(String),
                "pages": 145,
                "publisher": expect.any(String),
                "title": expect.any(String),
                "year": 2017
            }
        });
    });

    test("gets error if incorrect type of value added when updating a single book", async function() {
        const resp = await request(app)
          .put(`/books/0691161518`)
          .send({
            "book": {
                "isbn": "0691161518",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Linx",
                "language": "english",
                "pages": 'hey',
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking Hidden Math in Video Games",
                "year": 2017
            }  
        });
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({
            "error": {
                "message": [
                    "instance.book.pages is not of a type(s) number"
                ],
                "status": 400
            },
            "message": [
                "instance.book.pages is not of a type(s) number"
            ]
        });
    });

    test("delete a book", async function() {
        const resp = await request(app)
            .delete('/books/0691161518')

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({
            message: "Book deleted" 
        })
    })
})

afterAll(async function() {
    await db.end();
  });
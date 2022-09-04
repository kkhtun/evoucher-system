## Notes

Github Link
https://github.com/kkhtun/evoucher-system

Postman Workspace Invite Link
https://documenter.getpostman.com/view/14215090/VUxXJhks

Functional and ERD Diagrams
https://drive.google.com/drive/folders/1wIJ2BC5gAVe7Am6lZ6oAGbOJ1ajNZLVi?usp=sharing

## Pre-requisites

node v16
npm
redis-server
mongodb-server
aws s3

Main Estore Server will default to port 3000
Promo Codes API will default to port 5000
React Client will default to port 4000
Redis server will default to port 6379

## Notes

Both API Servers uses dependency injection via awilix to provide modular services across layers.
The project follows a bullet proof architecture API layer design consisting of

-   Middlewares
-   Router
-   Handler
-   Controller
-   Services
-   Models
    in a sequential manner. Request validation and subsequent error handling will be done in handler layer. Controller takes care of combining different service functionalities but does not contain main logic by itself. Services are the main logical layers, composed of reusable functions that can be triggered from anywhere. Each data-access service only interacts with its corresponding database ORM Model (eg. UserService -> UserModel)
    Authentication occurs in middleware using PassportJS Bearer, with local stretegy (using mobile and password).

    PromoCodesAPI is the promo code management service responsible for concurrent generation of promo codes using worker threads. I realize it will be more suitable to use a schduler but I ran out of time unfortunately. PromoCodesAPI will not be callable from outside. It can only be accessed using shared secret API key from estore-api server. E-store API is the client facing server responsible for major client workload.

    Redis acts as just a cache between Estore-API and PromoCodesAPI.

    Frontend client is written in create-react-app, due to time constraints, I only managed to build some CRUD routes, auth flow and validation for the frontend.

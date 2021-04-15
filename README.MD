# Discussion Forum

Developing the Backend for a Discussion Forum using GraphQL.

_This project is created just to learn about GraphQL, so I may or may not develop the frontend._

## Technology Used

- [**Apollo-Express**](https://www.apollographql.com/blog/using-express-with-graphql-server-node-js/) as a Server
- [**Postgres**](https://www.postgresql.org/) as a Database
- [**Sequlize**](https://sequelize.org/master/) as an ORM
- [**JWT**](https://github.com/auth0/node-jsonwebtoken) for authorization

## Setup

1. Clone the repo
1. Cd into the folder and install all dependencies
   ```shell
      cd discussion-forum
      npm install
   ```
1. Make sure you have Postgres installed in your computer if not install it from [here](https://www.postgresql.org/)
1. Open the Postgres shell and create a database
   ```shell
       create database discussion_forum;
   ```
1. Replace your database username and password in `src\models\index.js`
1. Start server from you terminal
   ```shell
       npm start
   ```

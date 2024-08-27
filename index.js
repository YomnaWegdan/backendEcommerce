import dotenv from 'dotenv';
import express from 'express';
import { initApp } from './src/initApp.js';

dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

initApp(app, express);

app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
        process.exit(1);
    }
    console.log(`Example app listening on port ${port}!`);
});


// import dotenv from "dotenv"
// import path from 'path'
// import express from 'express'
// import { initApp } from './src/initApp.js'
// dotenv.config()
// // dotenv.config({path:path.resolve(".env")})


// const port = process.env.PORT || 3001

// // app.set('case sensitive routing', true)

// const app = express()

// initApp(app, express)

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
const appRouter = require("./Routers/appRouter");
const connection = require("./Database/conn");
const errorMiddleware = require("./middlewares/error_middleware");

const port = process.env.PORT || 8000;

//cors for client site to send request to server.
const corsOptions = {
    origin: ["https://oibsip-client.onrender.com", "http://localhost:5173"],
    methods: "GET, POST, PATCH, DELETE, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(appRouter);
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

connection().then(() => {
    app.listen(port, () => {
        console.log(`listening at port : ${port}`);
    })
});

// All the environment Variables are here but not be pushed to the repository cause i will provide environment variables to the hosting  comapany.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./Routes/routes");
const connectSocket = require("./config/socket");
const corsConfig = require("./config/cors");
const path = require('path')
const bodyParser = require("body-parser");

const PORT = process.env.PORT;

const app = express();
// Sử dụng cors middleware ở đầu ứng dụng để gg không chặn request
app.use(cors());


app.use(cookieParser());

// Cấu hình Express để tự động parse các request JSON.
app.use(express.json());

// Áp dụng middleware CORS để cho phép tất cả các yêu cầu từ máy khách có địa chỉ gốc là 'http://localhost:3000'
app.use(cors(corsConfig));

// Sử dụng các route
routes(app);

// Connection MongoDB
connectDB();

// Connection to Socket Server
connectSocket();
// Socket connection port
app.listen(PORT);

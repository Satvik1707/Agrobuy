const express = require("express");
const { errorHandler } = require("./middlewares/errorMiddleware");
require("colors");
const products = require("./data/products");
const dotenv = require("dotenv");
const connectDb = require("./config/config");
const productRoutes = require("./routes/productsRoute");
const usersRoutes = require("./routes/UsersRoute");
const orderRoutes = require("./routes/orderRoute");

dotenv.config();
//connecting to mongodb database
connectDb();
const app = express();

//middleware bodyparser
app.use(express.json());

//dotenv config
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Server</h1>");
});

app.use("/api", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = 8080;
app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} Mode on Port ${process.env.PORT}`
      .inverse
  );
});

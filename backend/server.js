import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();
const app = express();

//2 middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//we are adding a middleware which will parse the json data into body of request
mongoose
  .connect(
    process.env.MONGODB_URL ||
      // "mongodb+srv://jobp_user:jobp123@cluster0.xghz9.mongodb.net/medico?retryWrites=true&w=majority",
      "mongodb://medico:UOFnYyIf1NmVhECuVRDU7n95eKZFZ0KFSF4SRel8TlhS6m60eCprPTl6sA8YK1PQHvl3g60FHrYLl2Wx50NcSA==@medico.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@medico@",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((ans) => {
    console.log("Koi problem nahi hai");
  })
  .catch((error) => {
    console.log(error.message);
  });
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
  );
  // app.get('/', function(req, res)  {
  //   // res.send('Server is ready');
  //   // res.render("index");
  //   res.sendFile(path.join(__dirname, '/template/index.html'))
  // });
const port = process.env.PORT || 5050;
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
}

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});

app.use('/api/uploads', uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});


app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

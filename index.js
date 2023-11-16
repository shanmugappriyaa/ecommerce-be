const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express()

const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;

const authRouter = require('./routes/authRoute')
const productRouter =require('./routes/productRoute')
const categoryRouter  = require('./routes/categoryRoute')
const brandRouter  = require('./routes/brandRoute')
const enqRouter = require("./routes/enqRoute");

const bodyParser = require("body-parser");
// const { notFound, errorHandler } = require('./middleware/errorHandler');
const error = require('mongoose/lib/error');
const cookieParser = require("cookie-parser");

dbConnect();
app.use(express.json())
// app.use(bodyParser.json());
app.use('/user',authRouter);
app.use('/product',productRouter)
app.use('/category',categoryRouter)
app.use('/brand',brandRouter)
app.use("/enquiry", enqRouter);
app.use(cookieParser())

// app.use(notFound);
// app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`server is listening in ${PORT}`)
})
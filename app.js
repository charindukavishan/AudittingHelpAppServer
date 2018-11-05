const express = require('express');
var app = express();
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));
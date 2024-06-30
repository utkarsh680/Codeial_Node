const express = require('express');
const app = express();

const port = 8000;


// user express router

app.use('/', require('./routes'));

//set up the view engine

app.set('view engine', 'ejs');
app.set('views', './views')


app.listen(port, (err) =>{
    if(err) {
        console.log(`error ${err}`)
    }else{
        console.log(`server runnig successfully on port, ${port}`)
    }
})
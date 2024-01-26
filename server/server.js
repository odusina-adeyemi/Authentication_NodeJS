import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';




const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // Hackers less know about our stack


const port = 8080;

/** HTTP Get Request */
app.get('/', (req, res) => {
res.status(201).json("Home Get Request")
});


/** api route */

app.use('/api', router);


/** start server only when we have valid connection*/

connect().then(() => {

    try {
        app.listen(port, () => {
    console.log(`Server connected to http://localhost:${port}`);
}) 
        
    } catch (error) {
        console.log('Can not connect to the server')
        
    }

}).catch((error) => {
    console.log('Invalid Databse Connection...!')
})





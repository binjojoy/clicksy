require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); 


const app = express();
const PORT = process.env.PORT || 5000; 


app.use(cors()); 
app.use(express.json());


app.use('/api/v1/auth', authRoutes);



app.get('/', (req, res) => {
    res.send('CLICKSY Backend Server is Running and Connected to Supabase!');
});


app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`Server is running on port ${PORT}`);
    console.log(`Auth Endpoints Ready: /api/v1/auth/register, /api/v1/auth/login`);
    console.log(`======================================================\n`);
});
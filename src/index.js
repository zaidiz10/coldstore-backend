require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes');
const baramadRoutes = require('./routes/baramadRoutes');
const customerRoutes = require('./routes/customerRoutes');
const customer_detailsRoutes = require('./routes/customer_detailsRoutes');
const daramadRoutes = require('./routes/daramadRoutes');
const khataRoutes = require('./routes/khataRoutes');
const userRoutes = require('./routes/userRoutes');
const shoproutes = require('./routes/shopRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/baramad', baramadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/customer_details', customer_detailsRoutes);
app.use('/api/daramad', daramadRoutes);
app.use('/api/khata', khataRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shops', shoproutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//node src/index.js    To run the server

//nodemon src/index.js    To run the server with nodemon


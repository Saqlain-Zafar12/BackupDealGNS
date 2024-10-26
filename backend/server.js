require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const attributesRoutes = require('./routes/attributesRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const webRelatedRoutes = require('./routes/webRelatedRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const deliveryTypeRoutes = require('./routes/deliveryTypeRoute'); // Add this line
const managerDashboardRoutes = require('./routes/managerDashboardRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://54.179.226.206', 'http://localhost:3000','http://gns.ae','http://www.gns.ae','https://gns.ae','https://www.gns.ae'],
  credentials: true 
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/attributes', attributesRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/manager-dashboard', managerDashboardRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/web', webRelatedRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/delivery-types', deliveryTypeRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

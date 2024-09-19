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

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://13.250.11.221', 'http://localhost:3000'],
  credentials: true 
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use auth routes
app.use('/api/v1/auth', authRoutes);

// Use category routes
app.use('/api/v1/categories', categoryRoutes);

// Use brand routes
app.use('/api/v1/brands', brandRoutes);

// Use attributes routes
app.use('/api/v1/attributes', attributesRoutes);

// Use product routes
app.use('/api/v1/products', productRoutes);

// Use order routes
app.use('/api/v1/orders', orderRoutes);

// Use web-related routes
app.use('/api/v1/web', webRelatedRoutes);

// Use dashboard routes
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(express.static(path.join(__dirname, 'build')));

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

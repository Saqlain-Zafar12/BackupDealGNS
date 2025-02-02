-- Drop tables if they exist (in reverse order of creation to avoid foreign key conflicts)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS attributes;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS delivery_types;

-- Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) NOT NULL DEFAULT 'manager'
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  en_category_name VARCHAR(255) NOT NULL,
  ar_category_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  en_brand_name VARCHAR(255) NOT NULL,
  ar_brand_name VARCHAR(255) NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE attributes (
  id SERIAL PRIMARY KEY,
  en_attribute_name VARCHAR(255) NOT NULL,
  ar_attribute_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER,
  brand_id INTEGER,
  sku VARCHAR(255) UNIQUE NOT NULL,
  actual_price NUMERIC(10, 2) NOT NULL,
  off_percentage_value NUMERIC(5, 2),
  price NUMERIC(10, 2) NOT NULL,
  en_title VARCHAR(255) NOT NULL,
  ar_title VARCHAR(255) NOT NULL,
  en_description TEXT,
  ar_description TEXT,
  attributes JSONB,
  delivery_charges NUMERIC(10, 2) DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  max_quantity_per_user INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  tabs_image_url JSONB,
  is_deal BOOLEAN DEFAULT false,
  sold INTEGER DEFAULT 0,
  is_hot_deal BOOLEAN DEFAULT false,
  vat_included BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  cost NUMERIC(10, 2) NOT NULL
);

CREATE TABLE delivery_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  web_user_id VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobilenumber BIGINT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_emirates VARCHAR(255) NOT NULL,
  delivery_address TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  selected_attributes TEXT[] NOT NULL,
  order_type VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (order_type IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_type_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (delivery_type_name) REFERENCES delivery_types(name)
);

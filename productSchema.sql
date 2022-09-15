CREATE DATABASE productsdb;

USE productsdb;

CREATE TABLE products (
  id INT UNIQUE NOT NULL,
  "name" text,
  slogan text,
  "description" text,
  category text,
  PRIMARY KEY (id)
);

CREATE TABLE styles (
  product_id INT,
  style_id INT UNIQUE,
  style_name TEXT,
  original_price INT,
  sale_price INT,
  "default" BOOLEAN,
  FOREIGN KEY (product_id)
  references products(id)
);

CREATE TABLE photos (
  style_id INT,
  photo_url TEXT,
  thumbnail TEXT,
  FOREIGN KEY (style_id)
  references styles(style_id)
);

CREATE TABLE skus (
  style_id INT,
  sku_id INT,
  size TEXT,
  quantity INT,
  FOREIGN KEY (style_id)
  references styles(style_id)
);

CREATE TABLE features (
  product_id INT,
  feature TEXT,
  "value" TEXT,
  FOREIGN KEY (product_id)
  references products(id)
);

CREATE TABLE related (
  product_id INT,
  related_id INT,
  FOREIGN KEY (product_id)
  references products(id)
);
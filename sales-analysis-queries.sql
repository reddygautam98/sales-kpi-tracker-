-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS sales_data (
    order_id VARCHAR(50),
    order_date DATE,
    customer_id VARCHAR(50),
    sales_person_id VARCHAR(50),
    product_id VARCHAR(50),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    state VARCHAR(2),
    city VARCHAR(100),
    store_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(50),
    product_name VARCHAR(100),
    category VARCHAR(50),
    brand VARCHAR(50),
    unit_price DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS sales_person (
    sales_person_id VARCHAR(50),
    sales_person_name VARCHAR(100),
    store_id VARCHAR(50)
);

-- 1. Total Sales Revenue
SELECT 
    SUM(total_amount) as total_sales_revenue
FROM sales_data;

-- 2. Sales Growth (Year over Year)
WITH yearly_sales AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) as sales_year,
        SUM(total_amount) as yearly_amount
    FROM sales_data
    GROUP BY EXTRACT(YEAR FROM order_date)
)
SELECT 
    sales_year,
    yearly_amount,
    LAG(yearly_amount) OVER (ORDER BY sales_year) as prev_year_amount,
    ((yearly_amount - LAG(yearly_amount) OVER (ORDER BY sales_year)) / 
     LAG(yearly_amount) OVER (ORDER BY sales_year)) * 100 as growth_percentage
FROM yearly_sales
ORDER BY sales_year;

-- 3. Total Order Count
SELECT 
    COUNT(DISTINCT order_id) as total_orders
FROM sales_data;

-- 4. Average Order Volume
SELECT 
    AVG(order_amount) as avg_order_value
FROM (
    SELECT 
        order_id,
        SUM(total_amount) as order_amount
    FROM sales_data
    GROUP BY order_id
) order_totals;

-- 5. Top Performing Sales Person
SELECT 
    sp.sales_person_name,
    COUNT(DISTINCT sd.order_id) as total_orders,
    SUM(sd.total_amount) as total_sales,
    AVG(sd.total_amount) as avg_order_value
FROM sales_data sd
JOIN sales_person sp ON sd.sales_person_id = sp.sales_person_id
GROUP BY sp.sales_person_id, sp.sales_person_name
ORDER BY total_sales DESC
LIMIT 1;

-- 6. Sales by Region (State and City)
SELECT 
    state,
    city,
    COUNT(DISTINCT order_id) as total_orders,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as avg_order_value
FROM sales_data
GROUP BY state, city
ORDER BY total_sales DESC;

-- 7. Product Demand Trends (Monthly)
SELECT 
    p.category,
    p.product_name,
    DATE_TRUNC('month', sd.order_date) as sales_month,
    SUM(sd.quantity) as units_sold,
    SUM(sd.total_amount) as total_sales
FROM sales_data sd
JOIN products p ON sd.product_id = p.product_id
GROUP BY p.category, p.product_name, DATE_TRUNC('month', sd.order_date)
ORDER BY sales_month, total_sales DESC;

-- 8. Sales Person Performance Rankings
WITH sales_metrics AS (
    SELECT 
        sp.sales_person_name,
        COUNT(DISTINCT sd.order_id) as total_orders,
        SUM(sd.quantity) as total_units,
        SUM(sd.total_amount) as total_sales,
        AVG(sd.total_amount) as avg_order_value,
        RANK() OVER (ORDER BY SUM(sd.total_amount) DESC) as sales_rank
    FROM sales_data sd
    JOIN sales_person sp ON sd.sales_person_id = sp.sales_person_id
    GROUP BY sp.sales_person_id, sp.sales_person_name
)
SELECT *
FROM sales_metrics
ORDER BY sales_rank;

-- 9. Top Selling Categories and Brands
SELECT 
    p.category,
    p.brand,
    COUNT(DISTINCT sd.order_id) as total_orders,
    SUM(sd.quantity) as total_units,
    SUM(sd.total_amount) as total_sales,
    RANK() OVER (ORDER BY SUM(sd.total_amount) DESC) as sales_rank
FROM sales_data sd
JOIN products p ON sd.product_id = p.product_id
GROUP BY p.category, p.brand
ORDER BY total_sales DESC;

-- 10. Sales Trend Over Time
WITH monthly_trends AS (
    SELECT 
        DATE_TRUNC('month', order_date) as sales_month,
        SUM(total_amount) as monthly_sales,
        COUNT(DISTINCT order_id) as total_orders,
        SUM(quantity) as total_units,
        LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) as prev_month_sales
    FROM sales_data
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
    sales_month,
    monthly_sales,
    total_orders,
    total_units,
    ((monthly_sales - prev_month_sales) / prev_month_sales) * 100 as month_over_month_growth
FROM monthly_trends
ORDER BY sales_month;

-- 11. Store Performance Analysis
SELECT 
    sd.store_id,
    COUNT(DISTINCT sd.order_id) as total_orders,
    COUNT(DISTINCT sd.customer_id) as total_customers,
    SUM(sd.quantity) as total_units,
    SUM(sd.total_amount) as total_sales,
    AVG(sd.total_amount) as avg_order_value,
    SUM(sd.total_amount) / COUNT(DISTINCT sd.customer_id) as revenue_per_customer
FROM sales_data sd
GROUP BY sd.store_id
ORDER BY total_sales DESC;

-- 12. Customer Purchase Analysis
SELECT 
    customer_id,
    COUNT(DISTINCT order_id) as total_orders,
    SUM(quantity) as total_units,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as avg_order_value,
    MIN(order_date) as first_purchase,
    MAX(order_date) as last_purchase
FROM sales_data
GROUP BY customer_id
ORDER BY total_spent DESC;

-- 13. Day of Week Analysis
SELECT 
    EXTRACT(DOW FROM order_date) as day_of_week,
    COUNT(DISTINCT order_id) as total_orders,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as avg_order_value
FROM sales_data
GROUP BY EXTRACT(DOW FROM order_date)
ORDER BY day_of_week;

-- 14. Product Category Performance by Region
SELECT 
    sd.state,
    p.category,
    COUNT(DISTINCT sd.order_id) as total_orders,
    SUM(sd.quantity) as total_units,
    SUM(sd.total_amount) as total_sales,
    RANK() OVER (PARTITION BY sd.state ORDER BY SUM(sd.total_amount) DESC) as category_rank_in_state
FROM sales_data sd
JOIN products p ON sd.product_id = p.product_id
GROUP BY sd.state, p.category
ORDER BY sd.state, total_sales DESC;

-- 15. Sales Performance Dashboard View
CREATE OR REPLACE VIEW sales_dashboard AS
SELECT 
    DATE_TRUNC('month', sd.order_date) as sales_month,
    sd.state,
    sd.city,
    sp.sales_person_name,
    p.category,
    p.brand,
    COUNT(DISTINCT sd.order_id) as total_orders,
    SUM(sd.quantity) as total_units,
    SUM(sd.total_amount) as total_sales,
    AVG(sd.total_amount) as avg_order_value
FROM sales_data sd
JOIN products p ON sd.product_id = p.product_id
JOIN sales_person sp ON sd.sales_person_id = sp.sales_person_id
GROUP BY 
    DATE_TRUNC('month', sd.order_date),
    sd.state,
    sd.city,
    sp.sales_person_name,
    p.category,
    p.brand;
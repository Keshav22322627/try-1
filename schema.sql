-- ====================================================================
-- INDIA HYUNDAI POWER - PRODUCTION POSTGRESQL DATABASE SCHEMA
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AREAS & TERRITORIES HIERARCHY TABLE
CREATE TABLE IF NOT EXISTS areas (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL CHECK (type IN ('Country', 'State', 'Region', 'District', 'Area')),
    parent_id VARCHAR(64) REFERENCES areas(id) ON DELETE SET NULL,
    code VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER ROLES ENUM & TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO roles (id, name, description) VALUES
('ADMIN', 'Administrator', 'Full access across all India territories to confirm/deny orders and manage delivery operations'),
('SALES_HEAD', 'Sales Head', 'Manages assigned region/state sales operations, sales persons, and dealers'),
('SALES_PERSON', 'Sales Person', 'Field sales representative handling assigned area dealers'),
('DEALER', 'Authorized Dealer', 'Primary client partner serving battery buyers and ordering inventory')
ON CONFLICT (id) DO NOTHING;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(32) NOT NULL REFERENCES roles(id),
    area_id VARCHAR(64) REFERENCES areas(id),
    area_name VARCHAR(255),
    sales_head_id VARCHAR(64) REFERENCES users(id),
    sales_person_id VARCHAR(64) REFERENCES users(id),
    business_name VARCHAR(255),
    gstin VARCHAR(32),
    avatar TEXT,
    status VARCHAR(32) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(64),
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCTS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(64) REFERENCES categories(id),
    category_name VARCHAR(255),
    brand VARCHAR(100) DEFAULT 'India Hyundai Power',
    short_description TEXT,
    full_description TEXT,
    sku VARCHAR(64) UNIQUE NOT NULL,
    capacity VARCHAR(64),
    voltage VARCHAR(32),
    warranty VARCHAR(128),
    price NUMERIC(12, 2) NOT NULL,
    dealer_price NUMERIC(12, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    stock_status VARCHAR(32) DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
    status VARCHAR(32) DEFAULT 'ACTIVE',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DELIVERY PERSONNEL TABLE
CREATE TABLE IF NOT EXISTS delivery_personnel (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    vehicle_number VARCHAR(64) NOT NULL,
    area_id VARCHAR(64) REFERENCES areas(id),
    area_name VARCHAR(255),
    status VARCHAR(32) DEFAULT 'ACTIVE',
    total_deliveries INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDERS TABLE (Core Transaction Table)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    client_id VARCHAR(64) REFERENCES users(id),
    client_name VARCHAR(255),
    client_phone VARCHAR(32),
    client_email VARCHAR(255),
    dealer_id VARCHAR(64) REFERENCES users(id) NOT NULL, -- All sales & alter operations must have a Dealer
    dealer_name VARCHAR(255) NOT NULL,
    sales_person_id VARCHAR(64) REFERENCES users(id),
    sales_person_name VARCHAR(255),
    sales_head_id VARCHAR(64) REFERENCES users(id),
    area_id VARCHAR(64) REFERENCES areas(id),
    area_name VARCHAR(255),
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0,
    tax NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0,
    amount_pending NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(32) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PARTIALLY_PAID', 'PAID')),
    order_status VARCHAR(32) DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    delivery_status VARCHAR(32) DEFAULT 'PENDING_DISPATCH' CHECK (delivery_status IN ('PENDING_DISPATCH', 'NOT_ASSIGNED', 'ASSIGNED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    delivery_address TEXT,
    delivery_person_id VARCHAR(64) REFERENCES delivery_personnel(id),
    delivery_person_name VARCHAR(255),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER ITEMS LINE ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(12, 2) NOT NULL
);

-- 9. PAYMENTS LEDGER TABLE (Only Sales Person & Sales Head can record)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    client_name VARCHAR(255),
    dealer_name VARCHAR(255),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(64) DEFAULT 'UPI',
    transaction_ref VARCHAR(128) NOT NULL,
    notes TEXT,
    recorded_by VARCHAR(255) NOT NULL,
    approval_status VARCHAR(32) DEFAULT 'APPROVED' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ACTIVITY LOGS AUDIT TRAIL
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    user_name VARCHAR(255),
    user_role VARCHAR(32),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS SYSTEM ALERTS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'SYSTEM',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES & BUSINESS GUARDRAILS
-- ====================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Dealers can SELECT their own orders
CREATE POLICY dealer_orders_select ON orders FOR SELECT
    USING (dealer_id = auth.uid()::text);

-- Policy 2: Dealers can INSERT orders for their dealership
CREATE POLICY dealer_orders_insert ON orders FOR INSERT
    WITH CHECK (dealer_id = auth.uid()::text);

-- Policy 3: Sales Persons can SELECT & UPDATE Dealer orders in their assigned area
CREATE POLICY sales_person_orders ON orders FOR ALL
    USING (
        dealer_id IS NOT NULL 
        AND (sales_person_id = auth.uid()::text OR area_id IN (SELECT area_id FROM users WHERE id = auth.uid()::text))
    );

-- Policy 4: Sales Heads can SELECT & UPDATE Dealer orders in their region
CREATE POLICY sales_head_orders ON orders FOR ALL
    USING (
        dealer_id IS NOT NULL 
        AND (sales_head_id = auth.uid()::text OR area_id LIKE (SELECT area_id || '%' FROM users WHERE id = auth.uid()::text))
    );

-- Policy 5: Admin full permissions across all orders to approve, deny, and manage delivery dispatches
CREATE POLICY admin_orders_all ON orders FOR ALL
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'));

-- ====================================================================
-- AUTOMATED PAYMENT LEDGER TRIGGER FUNCTION
-- ====================================================================

CREATE OR REPLACE FUNCTION recalculate_order_payment_ledger()
RETURNS TRIGGER AS $$
DECLARE
    v_total_paid NUMERIC(12,2);
    v_order_total NUMERIC(12,2);
    v_new_pending NUMERIC(12,2);
    v_new_status VARCHAR(32);
BEGIN
    SELECT total_amount INTO v_order_total FROM orders WHERE id = NEW.order_id;
    
    SELECT COALESCE(SUM(amount), 0) INTO v_total_paid 
    FROM payments 
    WHERE order_id = NEW.order_id AND approval_status = 'APPROVED';
    
    v_new_pending := GREATEST(0, v_order_total - v_total_paid);
    
    IF v_new_pending = 0 THEN
        v_new_status := 'PAID';
    ELSIF v_total_paid > 0 THEN
        v_new_status := 'PARTIALLY_PAID';
    ELSE
        v_new_status := 'UNPAID';
    END IF;
    
    UPDATE orders 
    SET amount_paid = v_total_paid,
        amount_pending = v_new_pending,
        payment_status = v_new_status
    WHERE id = NEW.order_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_recalculate_payment_ledger
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION recalculate_order_payment_ledger();

-- Enable RLS & full access for users and products table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_all_policy ON users;
CREATE POLICY users_all_policy ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS products_all_policy ON products;
CREATE POLICY products_all_policy ON products FOR ALL USING (true) WITH CHECK (true);

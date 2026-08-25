// India Hyundai Power - Database Service Layer (PostgreSQL + Local Store Bridge)

import { supabase, isPostgreSQLConfigured } from './supabaseClient.js';
import { dbStore } from '../data/dbStore.js';

export const dbService = {
  /**
   * Fetches orders for current user based on PostgreSQL RLS or local store
   */
  async getOrders(currentUser) {
    const localOrders = dbStore.getOrdersForUser(currentUser);
    if (isPostgreSQLConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('order_date', { ascending: false });

        if (!error && data && data.length > 0) {
          const localIds = new Set(localOrders.map(o => o.id));
          const remoteMatched = data.filter(o => localIds.has(o.id));
          if (remoteMatched.length > 0) return remoteMatched;
        }
      } catch (err) {
        console.warn('Supabase getOrders query warning:', err);
      }
    }
    return localOrders;
  },

  /**
   * Creates a new battery order in PostgreSQL or local store
   */
  async createOrder(orderData, currentUser) {
    const created = dbStore.createOrder(orderData, currentUser);
    if (isPostgreSQLConfigured) {
      try {
        await supabase
          .from('orders')
          .insert([
            {
              id: created.id,
              dealer_id: created.dealerId,
              dealer_name: created.dealerName,
              client_name: created.clientName,
              subtotal: created.subtotal,
              discount: created.discount,
              tax: created.tax,
              total_amount: created.totalAmount,
              amount_paid: 0,
              amount_pending: created.totalAmount,
              payment_status: 'UNPAID',
              order_status: created.orderStatus,
              delivery_status: created.deliveryStatus,
              area_id: created.areaId,
              area_name: created.areaName
            }
          ]);
      } catch (err) {
        console.warn('Supabase createOrder sync warning:', err);
      }
    }
    return created;
  },

  /**
   * Records payment transaction in PostgreSQL or local store
   */
  async recordPayment(paymentData, currentUser) {
    if (!currentUser || !['SALES_PERSON', 'SALES_HEAD'].includes(currentUser.role)) {
      throw new Error('Payment recording is restricted. Only Sales Persons and Sales Heads can add payment transactions.');
    }

    const payment = dbStore.recordPayment(paymentData, currentUser);
    if (isPostgreSQLConfigured) {
      try {
        await supabase
          .from('payments')
          .insert([
            {
              order_id: payment.orderId,
              amount: payment.amount,
              payment_method: payment.paymentMethod || 'UPI',
              transaction_ref: payment.transactionRef,
              notes: payment.notes,
              recorded_by: payment.recordedBy
            }
          ]);
      } catch (err) {
        console.warn('Supabase recordPayment sync warning:', err);
      }
    }
    return payment;
  },

  /**
   * Updates order status in PostgreSQL or local store (ADMIN ONLY)
   */
  async updateOrderStatus(orderId, newStatus, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Order confirmation, denial, and status changes are strictly restricted to Administrators.');
    }

    const updated = dbStore.updateOrderStatus(orderId, newStatus, currentUser);
    if (isPostgreSQLConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: newStatus })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase updateOrderStatus sync warning:', err);
      }
    }
    return updated;
  },

  /**
   * Updates delivery and logistics details (ADMIN ONLY)
   */
  async updateOrderDelivery(orderId, deliveryData, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Modifying delivery details is strictly restricted to Administrators.');
    }

    const updated = dbStore.updateOrderDelivery(orderId, deliveryData, currentUser);
    if (isPostgreSQLConfigured) {
      try {
        const payload = {
          delivery_status: deliveryData.deliveryStatus,
          courier_partner: deliveryData.courierPartner,
          tracking_number: deliveryData.trackingNumber,
          expected_delivery_date: deliveryData.expectedDeliveryDate
        };
        if (deliveryData.deliveryStatus === 'DELIVERED') {
          payload.order_status = 'DELIVERED';
        } else if (deliveryData.deliveryStatus === 'CANCELLED') {
          payload.order_status = 'CANCELLED';
        }

        await supabase
          .from('orders')
          .update(payload)
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase updateOrderDelivery sync warning:', err);
      }
    }
    return updated;
  },

  // --- PRODUCTS MANAGEMENT ---
  async getProducts() {
    const localProducts = dbStore.getProducts();
    if (isPostgreSQLConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (!error && data && data.length > 0) {
          const localIds = new Set(localProducts.map(p => p.id));
          const remoteProducts = data.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            brand: p.brand || 'India Hyundai Power',
            sku: p.sku,
            category: p.category_name || p.category || 'Automotive Batteries',
            capacity: p.capacity || '65 Ah',
            voltage: p.voltage || '12V',
            warranty: p.warranty || '36 Months',
            price: Number(p.price || 0),
            dealerPrice: Number(p.dealer_price || p.price || 0),
            stockQuantity: Number(p.stock_quantity || 0),
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800']
          })).filter(p => localIds.has(p.id));
          if (remoteProducts.length > 0) return remoteProducts;
        }
      } catch (err) {
        console.warn('Supabase getProducts warning:', err);
      }
    }
    return localProducts;
  },

  async createProduct(productData, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Product catalog modification is strictly restricted to Administrators.');
    }
    const createdLocal = dbStore.addProduct(productData);
    if (isPostgreSQLConfigured) {
      try {
        const newProd = {
          id: createdLocal.id || `prod-${Date.now()}`,
          name: productData.name,
          slug: (productData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brand: productData.brand || 'India Hyundai Power',
          sku: productData.sku,
          category_name: productData.category,
          capacity: productData.capacity,
          voltage: productData.voltage,
          warranty: productData.warranty,
          price: parseFloat(productData.price) || 0,
          dealer_price: parseFloat(productData.dealerPrice) || 0,
          stock_quantity: parseInt(productData.stockQuantity, 10) || 0,
          images: productData.images || ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800']
        };

        await supabase.from('products').insert([newProd]);
      } catch (err) {
        console.warn('Supabase createProduct sync warning:', err);
      }
    }
    return createdLocal;
  },

  async deleteProduct(productId, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Product catalog deletion is strictly restricted to Administrators.');
    }
    if (isPostgreSQLConfigured) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (err) {
        console.warn('Error deleting product from Supabase:', err);
      }
    }
    return dbStore.deleteProduct(productId);
  },

  // --- USERS & STAFF MANAGEMENT ---
  async getUsers(currentUser) {
    const localUsers = dbStore.getUsersForUser(currentUser);
    if (isPostgreSQLConfigured) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && data && data.length > 0) {
          const localIds = new Set(localUsers.map(u => u.id));
          const remoteUsers = data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            areaId: u.area_id,
            areaName: u.area_name,
            businessName: u.business_name,
            gstin: u.gstin,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            status: u.status || 'ACTIVE'
          })).filter(u => localIds.has(u.id));
          if (remoteUsers.length > 0) return remoteUsers;
        }
      } catch (err) {
        console.warn('Supabase getUsers warning:', err);
      }
    }
    return localUsers;
  },

  async createUser(userData, currentUser) {
    if (currentUser) {
      if (currentUser.role === 'SALES_HEAD' && !['SALES_PERSON', 'DEALER'].includes(userData.role)) {
        throw new Error('Unauthorized: Sales Head can only add Sales Persons or Dealers.');
      }
      if (currentUser.role === 'SALES_PERSON' && userData.role !== 'DEALER') {
        throw new Error('Unauthorized: Sales Person can only add Dealers.');
      }
      if (['DEALER', 'CLIENT'].includes(currentUser.role)) {
        throw new Error('Unauthorized: User creation restricted.');
      }
    }

    const createdLocal = dbStore.addUser(userData);

    if (isPostgreSQLConfigured) {
      try {
        const newUser = {
          id: userData.id || `usr-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          area_id: userData.areaId,
          area_name: userData.areaName,
          business_name: userData.businessName,
          gstin: userData.gstin,
          avatar: userData.avatar
        };
        await supabase.from('users').insert([newUser]);
      } catch (err) {
        console.warn('Error creating user in Supabase:', err);
      }
    }
    return createdLocal;
  },

  async deleteUser(userId, currentUser) {
    if (currentUser && ['DEALER', 'CLIENT'].includes(currentUser.role)) {
      throw new Error('Unauthorized: User removal restricted.');
    }
    if (isPostgreSQLConfigured) {
      try {
        await supabase.from('users').delete().eq('id', userId);
      } catch (err) {
        console.warn('Error deleting user from Supabase:', err);
      }
    }
    return dbStore.deleteUser(userId);
  },

  // --- AREA-WISE STAFF & DEALERS REPORT ---
  async getAreaWiseStaffAndDealers(currentUser) {
    const localData = dbStore.getAreaWiseStaffAndDealers(currentUser);
    if (isPostgreSQLConfigured) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .in('role', ['SALES_HEAD', 'SALES_PERSON', 'DEALER'])
          .order('area_name', { ascending: true })
          .order('role', { ascending: true });

        if (!error && data && data.length > 0) {
          const grouped = data.reduce((acc, user) => {
            const areaKey = user.area_name || user.area_id || 'Unassigned';
            if (!acc[areaKey]) {
              acc[areaKey] = {
                areaId: user.area_id,
                areaName: user.area_name || 'Unassigned',
                salesHeads: [],
                salesPersons: [],
                dealers: [],
                totalStaff: 0,
                totalDealers: 0
              };
            }
            const userData = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              areaId: user.area_id,
              areaName: user.area_name,
              businessName: user.business_name,
              gstin: user.gstin,
              avatar: user.avatar,
              status: user.status || 'ACTIVE',
              salesHeadId: user.sales_head_id,
              salesPersonId: user.sales_person_id
            };
            
            if (user.role === 'SALES_HEAD') {
              acc[areaKey].salesHeads.push(userData);
              acc[areaKey].totalStaff++;
            } else if (user.role === 'SALES_PERSON') {
              acc[areaKey].salesPersons.push(userData);
              acc[areaKey].totalStaff++;
            } else if (user.role === 'DEALER') {
              acc[areaKey].dealers.push(userData);
              acc[areaKey].totalDealers++;
            }
            return acc;
          }, {});
          
          return Object.values(grouped);
        }
      } catch (err) {
        console.warn('Supabase getAreaWiseStaffAndDealers warning:', err);
      }
    }
    return localData;
  },

  // --- DELIVERY PARTNERS MANAGEMENT (ADMIN ONLY) ---
  async getDeliveryPartners() {
    return dbStore.getDeliveryPersonnel();
  },

  async addDeliveryPartner(partnerData, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Adding delivery partners is strictly restricted to Administrators.');
    }
    return dbStore.addDeliveryPartner(partnerData, currentUser);
  },

  async deleteDeliveryPartner(partnerId, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Deleting delivery partners is strictly restricted to Administrators.');
    }
    return dbStore.deleteDeliveryPartner(partnerId, currentUser);
  },

  // --- COMPLAINTS & SERVICE TICKETS ---
  async getComplaints(currentUser) {
    return dbStore.getComplaintsForUser(currentUser);
  },

  async createComplaint(complaintData, currentUser) {
    return dbStore.createComplaint(complaintData, currentUser);
  },

  async assignPersonToComplaint(complaintId, personData, currentUser) {
    return dbStore.assignPersonToComplaint(complaintId, personData, currentUser);
  },

  async updateComplaintStatus(complaintId, statusData, currentUser) {
    return dbStore.updateComplaintStatus(complaintId, statusData, currentUser);
  }
};

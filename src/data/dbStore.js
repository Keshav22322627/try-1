// India Hyundai Power - Database Store & Access Control Engine

import {
  INITIAL_AREAS,
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_PERSONNEL,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS
} from './seedData.js';

const STORAGE_KEYS = {
  AREAS: 'ihp_areas_v9',
  ROLES: 'ihp_roles_v9',
  USERS: 'ihp_users_v9',
  CATEGORIES: 'ihp_categories_v9',
  PRODUCTS: 'ihp_products_v9',
  DELIVERY_PERSONNEL: 'ihp_delivery_personnel_v9',
  ORDERS: 'ihp_orders_v9',
  PAYMENTS: 'ihp_payments_v9',
  NOTIFICATIONS: 'ihp_notifications_v9',
  LOGS: 'ihp_activity_logs_v9',
  COMPLAINTS: 'ihp_complaints_v9'
};

const getFromStorage = (key, fallback) => {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

const setToStorage = (key, data) => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
};

class DBStore {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (typeof localStorage === 'undefined') return;

    // Clear out any obsolete mock data keys from earlier sessions (v1-v8)
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('ihp_') && !k.endsWith('_v9')) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.error('Error clearing legacy storage keys:', e);
    }

    if (!localStorage.getItem(STORAGE_KEYS.AREAS)) {
      this.resetDatabase();
    }
  }

  resetDatabase() {
    setToStorage(STORAGE_KEYS.AREAS, INITIAL_AREAS);
    setToStorage(STORAGE_KEYS.ROLES, INITIAL_ROLES);
    setToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    setToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setToStorage(STORAGE_KEYS.DELIVERY_PERSONNEL, INITIAL_DELIVERY_PERSONNEL);
    setToStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setToStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    setToStorage(STORAGE_KEYS.LOGS, []);
    setToStorage(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  }

  clearAllMockData() {
    setToStorage(STORAGE_KEYS.ORDERS, []);
    setToStorage(STORAGE_KEYS.PAYMENTS, []);
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    setToStorage(STORAGE_KEYS.LOGS, []);
    setToStorage(STORAGE_KEYS.COMPLAINTS, []);
  }

  // --- COMPLAINTS & SERVICE TICKETS ---
  getComplaints() { return getFromStorage(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS); }
  saveComplaints(complaints) { setToStorage(STORAGE_KEYS.COMPLAINTS, complaints); }

  getComplaintsForUser(currentUser) {
    const all = this.getComplaints();
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'ADMIN':
        return all;
      case 'SALES_HEAD':
      case 'SALES_PERSON':
        return all;
      case 'DEALER':
        return all.filter(c => c.dealerId === currentUser.id || c.dealerId === currentUser.dealerId);
      default:
        return [];
    }
  }

  createComplaint(complaintData, currentUser) {
    const complaints = this.getComplaints();
    const newComplaint = {
      id: `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      dealerId: currentUser?.id || 'usr-dealer-ldh',
      dealerName: currentUser?.businessName || currentUser?.name || 'Authorized Dealer',
      dealerPhone: currentUser?.phone || '+91 98765 00000',
      areaId: currentUser?.areaId || 'area-in',
      areaName: currentUser?.areaName || 'India',
      clientName: complaintData.clientName || 'Customer',
      clientPhone: complaintData.clientPhone || '+91 98000 00000',
      batteryModel: complaintData.batteryModel || 'Hyundai Solaria Battery',
      orderId: complaintData.orderId || null,
      issueType: complaintData.issueType || 'GENERAL_SERVICE',
      description: complaintData.description || 'Battery performance issue reported by dealer.',
      priority: complaintData.priority || 'MEDIUM',
      status: 'PENDING',
      assignedPersonId: null,
      assignedPersonName: null,
      assignedPersonPhone: null,
      assignedPersonRole: null,
      resolutionNotes: ''
    };

    const updated = [newComplaint, ...complaints];
    this.saveComplaints(updated);

    this.logActivity('COMPLAINT_FILED', `Complaint ${newComplaint.id} filed by dealer ${newComplaint.dealerName} for ${newComplaint.batteryModel}`, currentUser);
    this.addNotification({
      title: 'New Dealer Complaint Filed',
      message: `Dealer ${newComplaint.dealerName} registered complaint ${newComplaint.id} (${newComplaint.issueType})`,
      type: 'COMPLAINT',
      targetRoles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON']
    });

    return newComplaint;
  }

  assignPersonToComplaint(complaintId, personData, currentUser) {
    if (!currentUser || !['ADMIN', 'SALES_HEAD', 'SALES_PERSON'].includes(currentUser.role)) {
      throw new Error('Unauthorized: Assigning service personnel to complaints is restricted to Staff and Admins.');
    }

    const complaints = this.getComplaints();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) throw new Error('Complaint not found');

    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          assignedPersonId: personData.id,
          assignedPersonName: personData.name,
          assignedPersonPhone: personData.phone || '+91 98765 00000',
          assignedPersonRole: personData.role || 'Service Representative',
          status: c.status === 'PENDING' ? 'ASSIGNED' : c.status
        };
      }
      return c;
    });

    this.saveComplaints(updated);
    this.logActivity('COMPLAINT_ASSIGNED', `Assigned ${personData.name} to complaint ${complaintId}`, currentUser);
    this.addNotification({
      title: 'Complaint Assigned',
      message: `${personData.name} was assigned to handle complaint ${complaintId}`,
      type: 'COMPLAINT',
      targetRoles: ['DEALER', 'ADMIN', 'SALES_HEAD', 'SALES_PERSON']
    });

    return updated;
  }

  updateComplaintStatus(complaintId, statusData, currentUser) {
    if (!currentUser || !['ADMIN', 'SALES_HEAD', 'SALES_PERSON'].includes(currentUser.role)) {
      throw new Error('Unauthorized: Updating complaint status is restricted to Staff and Admins.');
    }

    const complaints = this.getComplaints();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) throw new Error('Complaint not found');

    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: statusData.status || c.status,
          resolutionNotes: statusData.resolutionNotes !== undefined ? statusData.resolutionNotes : c.resolutionNotes
        };
      }
      return c;
    });

    this.saveComplaints(updated);
    this.logActivity('COMPLAINT_STATUS_UPDATED', `Updated complaint ${complaintId} status to "${statusData.status}"`, currentUser);
    this.addNotification({
      title: 'Complaint Status Update',
      message: `Complaint ${complaintId} status changed to ${statusData.status}`,
      type: 'COMPLAINT',
      targetRoles: ['DEALER', 'ADMIN', 'SALES_HEAD', 'SALES_PERSON']
    });

    return updated;
  }

  // --- AREA ACCESS CONTROL HELPERS ---
  getAreas() { return getFromStorage(STORAGE_KEYS.AREAS, INITIAL_AREAS); }
  saveAreas(areas) { setToStorage(STORAGE_KEYS.AREAS, areas); }
  deleteArea(areaId) {
    const areas = this.getAreas();
    const updated = areas.filter(a => a.id !== areaId);
    this.saveAreas(updated);
    return updated;
  }
  resetAreas() {
    this.saveAreas(INITIAL_AREAS);
    return INITIAL_AREAS;
  }

  getUsers() { return getFromStorage(STORAGE_KEYS.USERS, []); }
  saveUsers(users) { setToStorage(STORAGE_KEYS.USERS, users); }
  addUser(user) {
    const users = this.getUsers();
    const updated = [user, ...users];
    this.saveUsers(updated);
    return user;
  }
  deleteUser(userId) {
    const users = this.getUsers();
    const updated = users.filter(u => u.id !== userId);
    this.saveUsers(updated);
    return true;
  }

  updateUserPassword(userId, newPassword, currentUser) {
    if (!currentUser) {
      throw new Error('Unauthorized Access: Must be logged in to update password.');
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isSelf = currentUser.id === userId;
    const isManager = ['SALES_HEAD', 'SALES_PERSON'].includes(currentUser.role);

    if (!isSelf && !isAdmin && !isManager) {
      throw new Error('Unauthorized Access: You can only change your own password or user passwords in your area.');
    }

    if (!newPassword || newPassword.trim().length < 4) {
      throw new Error('Validation Error: Password must be at least 4 characters long.');
    }

    const users = this.getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User not found.');

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPassword.trim() };
      }
      return u;
    });

    this.saveUsers(updatedUsers);
    this.logActivity('PASSWORD_CHANGED', `Updated password for ${targetUser.name} (${targetUser.email}).`, currentUser);
    return true;
  }

  getProducts() { return getFromStorage(STORAGE_KEYS.PRODUCTS, []); }
  saveProducts(products) { setToStorage(STORAGE_KEYS.PRODUCTS, products); }
  addProduct(product) {
    const products = this.getProducts();
    const updated = [product, ...products];
    this.saveProducts(updated);
    return product;
  }
  deleteProduct(productId) {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== productId);
    this.saveProducts(updated);
    return true;
  }

  getCategories() { return getFromStorage(STORAGE_KEYS.CATEGORIES, []); }
  saveCategories(categories) { setToStorage(STORAGE_KEYS.CATEGORIES, categories); }

  getOrders() { return getFromStorage(STORAGE_KEYS.ORDERS, []); }
  saveOrders(orders) { setToStorage(STORAGE_KEYS.ORDERS, orders); }

  getPayments() { return getFromStorage(STORAGE_KEYS.PAYMENTS, []); }
  savePayments(payments) { setToStorage(STORAGE_KEYS.PAYMENTS, payments); }

  getNotifications() { return getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []); }
  saveNotifications(notifs) { setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs); }

  getLogs() { return getFromStorage(STORAGE_KEYS.LOGS, []); }
  logActivity(action, details, user) {
    const logs = this.getLogs();
    const newLog = {
      id: 'log-' + Date.now(),
      action,
      details,
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      userRole: user?.role || 'SYSTEM',
      timestamp: new Date().toISOString()
    };
    setToStorage(STORAGE_KEYS.LOGS, [newLog, ...logs].slice(0, 100));
  }

  // --- ROLE-BASED SCOPED DATA QUERIES ---

  /**
  /**
   * Filters orders based on current user role and area assignment.
   * Sales Persons and Sales Heads can ONLY see Dealer orders.
   */
  getOrdersForUser(currentUser) {
    const allOrders = this.getOrders();
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'ADMIN':
        return allOrders;
      case 'SALES_HEAD':
        // Sales Heads can ONLY see Dealer orders in their region/area
        return allOrders.filter(
          o => Boolean(o.dealerId || o.dealerName) && (
            o.salesHeadId === currentUser.id ||
            o.areaId.startsWith(currentUser.areaId) ||
            (currentUser.areaId === 'area-pb-reg' && (o.areaId.includes('ldh') || o.areaId.includes('asr')))
          )
        );
      case 'SALES_PERSON':
        // Sales Persons can ONLY see Dealer orders assigned to them or in their area
        return allOrders.filter(
          o => Boolean(o.dealerId || o.dealerName) && (
            o.salesPersonId === currentUser.id ||
            o.areaId === currentUser.areaId
          )
        );
      case 'DEALER':
        // Returns orders created by or for this dealership
        return allOrders.filter(
          o => o.dealerId === currentUser.id || o.dealerId === currentUser.dealerId
        );
      case 'CLIENT':
        // Returns orders placed by this specific client
        return allOrders.filter(
          o => o.clientId === currentUser.id || o.clientEmail === currentUser.email
        );
      default:
        return [];
    }
  }

  /**
   * Filters payments based on current user role
   */
  getPaymentsForUser(currentUser) {
    const allPayments = this.getPayments();
    const userOrders = this.getOrdersForUser(currentUser);
    const validOrderIds = new Set(userOrders.map(o => o.id));

    if (currentUser?.role === 'ADMIN') return allPayments;
    return allPayments.filter(p => validOrderIds.has(p.orderId));
  }

  /**
   * Filters users based on current user role
   */
  getUsersForUser(currentUser) {
    const allUsers = this.getUsers();
    if (!currentUser) return [];

    switch (currentUser.role) {
      case 'ADMIN':
        return allUsers;
      case 'SALES_HEAD':
        // Sales head sees sales persons, dealers, clients in their region
        return allUsers.filter(
          u => u.salesHeadId === currentUser.id || u.id === currentUser.id || u.role === 'SALES_PERSON' || u.role === 'DEALER' || u.role === 'CLIENT'
        );
      case 'SALES_PERSON':
        // Sales person sees assigned dealers and clients
        return allUsers.filter(
          u => u.salesPersonId === currentUser.id || u.id === currentUser.id || u.role === 'DEALER' || u.role === 'CLIENT'
        );
      case 'DEALER':
        // Dealer sees own record and their clients
        return allUsers.filter(
          u => u.dealerId === currentUser.id || u.id === currentUser.id
        );
      case 'CLIENT':
        // Client sees only themselves
        return allUsers.filter(u => u.id === currentUser.id);
      default:
        return [];
    }
  }

  // --- MUTATION METHODS WITH AUTOMATIC LEDGER CALCULATIONS ---

  createOrder(orderData, currentUser) {
    const orders = this.getOrders();

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discount = orderData.discount || 0;
    const tax = Math.round((subtotal - discount) * 0.10); // 10% GST
    const totalAmount = subtotal - discount + tax;

    const newOrder = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString(),
      clientId: orderData.clientId || currentUser?.id || 'usr-client-1',
      clientName: orderData.clientName || currentUser?.name || 'Walk-in Client',
      clientPhone: orderData.clientPhone || '+91 98000 00000',
      clientEmail: orderData.clientEmail || 'client@example.com',
      dealerId: orderData.dealerId || currentUser?.dealerId || 'usr-dealer-ldh',
      dealerName: orderData.dealerName || 'Ludhiana Power Hub',
      salesPersonId: orderData.salesPersonId || 'usr-sp-ldh',
      salesPersonName: orderData.salesPersonName || 'Gurpreet Singh',
      salesHeadId: orderData.salesHeadId || 'usr-sh-pb',
      areaId: orderData.areaId || 'area-ldh-central',
      areaName: orderData.areaName || 'Ludhiana Central',
      items: orderData.items,
      subtotal,
      discount,
      tax,
      totalAmount,
      amountPaid: 0,
      amountPending: totalAmount,
      paymentStatus: 'UNPAID',
      orderStatus: 'PENDING',
      deliveryStatus: 'PENDING_DISPATCH',
      deliveryAddress: orderData.deliveryAddress || 'Client Delivery Address',
      expectedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      notes: orderData.notes || 'Order placed via portal.'
    };

    const updatedOrders = [newOrder, ...orders];
    this.saveOrders(updatedOrders);

    this.logActivity('ORDER_CREATED', `Order ${newOrder.id} created for ${newOrder.clientName} (₹${newOrder.totalAmount.toLocaleString('en-IN')})`, currentUser);
    this.addNotification({
      title: 'New Order Received',
      message: `Order ${newOrder.id} placed for ₹${newOrder.totalAmount.toLocaleString('en-IN')}`,
      type: 'ORDER',
      targetRoles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON', 'DEALER']
    });

    return newOrder;
  }

  /**
   * Records a payment against an order and re-calculates paid & pending totals.
   * Sales Persons and Sales Heads can ONLY add payments to Dealer orders.
   */
  recordPayment(paymentData, currentUser) {
    if (!currentUser || !['SALES_PERSON', 'SALES_HEAD'].includes(currentUser.role)) {
      throw new Error('Payment recording is restricted. Only Sales Persons and Sales Heads can add payment transactions.');
    }

    const payments = this.getPayments();
    const orders = this.getOrders();

    const targetOrder = orders.find(o => o.id === paymentData.orderId);
    if (!targetOrder) throw new Error('Order not found');

    if (!targetOrder.dealerId && !targetOrder.dealerName) {
      throw new Error('Sales Persons and Sales Heads can only see or alter Dealer orders.');
    }

    const paymentAmount = Number(paymentData.amount);
    const newPayment = {
      id: `PAY-${targetOrder.id.replace('ORD-', '')}-${String.fromCharCode(65 + (payments.filter(p => p.orderId === targetOrder.id).length))}`,
      orderId: targetOrder.id,
      clientName: targetOrder.clientName,
      dealerName: targetOrder.dealerName,
      amount: paymentAmount,
      paymentDate: new Date().toISOString(),
      paymentMethod: paymentData.paymentMethod || 'UPI',
      transactionRef: paymentData.transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      notes: paymentData.notes || 'Payment recorded',
      recordedBy: `${currentUser?.name || 'User'} (${currentUser?.role || 'USER'})`,
      approvalStatus: 'APPROVED'
    };

    const updatedPayments = [newPayment, ...payments];
    this.savePayments(updatedPayments);

    // Re-calculate Total Paid and Total Pending for this Order
    const orderPayments = updatedPayments.filter(p => p.orderId === targetOrder.id && p.approvalStatus === 'APPROVED');
    const newAmountPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
    const newAmountPending = Math.max(0, targetOrder.totalAmount - newAmountPaid);

    let newPaymentStatus = 'UNPAID';
    if (newAmountPending === 0) {
      newPaymentStatus = 'PAID';
    } else if (newAmountPaid > 0) {
      newPaymentStatus = 'PARTIALLY_PAID';
    }

    const updatedOrders = orders.map(o => {
      if (o.id === targetOrder.id) {
        return {
          ...o,
          amountPaid: newAmountPaid,
          amountPending: newAmountPending,
          paymentStatus: newPaymentStatus
        };
      }
      return o;
    });

    this.saveOrders(updatedOrders);

    this.logActivity(
      'PAYMENT_RECORDED',
      `Recorded ₹${paymentAmount.toLocaleString('en-IN')} payment for Order ${targetOrder.id}. Pending: ₹${newAmountPending.toLocaleString('en-IN')}`,
      currentUser
    );

    this.addNotification({
      title: 'Payment Logged',
      message: `Payment of ₹${paymentAmount.toLocaleString('en-IN')} logged for ${targetOrder.id}. Status: ${newPaymentStatus}`,
      type: 'PAYMENT',
      targetRoles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON', 'DEALER']
    });

    return newPayment;
  }

  updateOrderStatus(orderId, newStatus, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Order confirmation, denial, and status updates are strictly restricted to Administrators.');
    }

    const orders = this.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) throw new Error('Order not found');

    if (targetOrder.orderStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
      throw new Error('Action Restricted: Cancelled orders are permanently closed and cannot be changed.');
    }

    const approvedStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const isApproved = approvedStatuses.includes(targetOrder.orderStatus);

    if (isApproved && (newStatus === 'PENDING' || newStatus === 'CANCELLED')) {
      throw new Error('Action Restricted: Once an order is approved, it cannot be reverted to PENDING or CANCELLED status.');
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          orderStatus: newStatus,
          ...(newStatus === 'CANCELLED' || newStatus === 'DENIED' ? { deliveryStatus: 'CANCELLED' } : {})
        };
      }
      return o;
    });
    this.saveOrders(updatedOrders);

    this.logActivity(
      'ORDER_STATUS_UPDATED',
      `Order ${orderId} status updated to "${newStatus}" by Admin ${currentUser?.name || ''}`,
      currentUser
    );

    this.addNotification({
      title: 'Order Status Update',
      message: `Order ${orderId} status changed to ${newStatus}`,
      type: 'ORDER',
      targetRoles: ['ADMIN', 'SALES_HEAD', 'SALES_PERSON', 'DEALER']
    });

    return updatedOrders;
  }

  updateOrderDelivery(orderId, deliveryData, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Modifying delivery details is strictly restricted to Administrators.');
    }

    const orders = this.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) throw new Error('Order not found');

    const newDeliveryStatus = deliveryData.deliveryStatus || targetOrder.deliveryStatus || 'PENDING_DISPATCH';
    let newOrderStatus = targetOrder.orderStatus;
    if (newDeliveryStatus === 'DELIVERED') {
      newOrderStatus = 'DELIVERED';
    } else if (newDeliveryStatus === 'CANCELLED') {
      newOrderStatus = 'CANCELLED';
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryStatus: newDeliveryStatus,
          orderStatus: newOrderStatus,
          courierPartner: deliveryData.courierPartner !== undefined ? deliveryData.courierPartner : o.courierPartner,
          trackingNumber: deliveryData.trackingNumber !== undefined ? deliveryData.trackingNumber : o.trackingNumber,
          expectedDeliveryDate: deliveryData.expectedDeliveryDate !== undefined ? deliveryData.expectedDeliveryDate : o.expectedDeliveryDate,
          dispatchDate: deliveryData.dispatchDate !== undefined ? deliveryData.dispatchDate : o.dispatchDate,
          deliveryAddress: deliveryData.deliveryAddress !== undefined ? deliveryData.deliveryAddress : o.deliveryAddress,
          driverPhone: deliveryData.driverPhone !== undefined ? deliveryData.driverPhone : o.driverPhone
        };
      }
      return o;
    });

    this.saveOrders(updatedOrders);
    this.logActivity(
      'DELIVERY_UPDATED',
      `Delivery details updated for Order ${orderId} by Admin ${currentUser?.name || ''}`,
      currentUser
    );

    return updatedOrders;
  }

  assignDelivery(orderId, deliveryPersonId, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Assigning delivery personnel is strictly restricted to Administrators.');
    }

    const orders = this.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) throw new Error('Order not found');

    const dpList = this.getDeliveryPersonnel();
    const person = dpList.find(p => p.id === deliveryPersonId);

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          deliveryPersonId,
          deliveryPersonName: person?.name || 'Assigned Agent',
          deliveryStatus: 'ASSIGNED'
        };
      }
      return o;
    });
    this.saveOrders(updatedOrders);
    this.logActivity('DELIVERY_ASSIGNED', `Assigned delivery agent ${person?.name} to Order ${orderId}`, currentUser);
  }

  getDeliveryPersonnel() {
    return getFromStorage(STORAGE_KEYS.DELIVERY_PERSONNEL, INITIAL_DELIVERY_PERSONNEL);
  }

  saveDeliveryPersonnel(list) {
    setToStorage(STORAGE_KEYS.DELIVERY_PERSONNEL, list);
  }

  addDeliveryPartner(partnerData, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Adding delivery partners is strictly restricted to Administrators.');
    }
    const list = this.getDeliveryPersonnel();
    const newPartner = {
      id: partnerData.id || `dp-${Date.now()}`,
      name: partnerData.name,
      phone: partnerData.phone || '+91 98765 00000',
      vehicleNumber: partnerData.vehicleNumber || 'Freight Carrier / Logistics',
      areaName: partnerData.areaName || 'All India / Pan Regional',
      status: 'ACTIVE',
      totalDeliveries: 0,
      rating: 5.0
    };
    const updated = [newPartner, ...list];
    this.saveDeliveryPersonnel(updated);
    this.logActivity('DELIVERY_PARTNER_ADDED', `Added delivery partner "${newPartner.name}" by Admin`, currentUser);
    return updated;
  }

  deleteDeliveryPartner(partnerId, currentUser) {
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Deleting delivery partners is strictly restricted to Administrators.');
    }
    const list = this.getDeliveryPersonnel();
    const updated = list.filter(p => p.id !== partnerId);
    this.saveDeliveryPersonnel(updated);
    this.logActivity('DELIVERY_PARTNER_DELETED', `Removed delivery partner ID ${partnerId} by Admin`, currentUser);
    return updated;
  }

  addNotification(notif) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notif
    };
    this.saveNotifications([newNotif, ...notifs].slice(0, 50));
  }

  /**
   * Gets all staff and dealers grouped by area
   * Returns array of areas with sales heads, sales persons, and dealers
   */
  getAreaWiseStaffAndDealers(currentUser) {
    const allUsers = this.getUsers();
    const areas = this.getAreas();
    
    if (!currentUser) return [];

    // Filter users based on role (only staff and dealers)
    let filteredUsers = allUsers.filter(u => ['SALES_HEAD', 'SALES_PERSON', 'DEALER'].includes(u.role));
    
    // Apply role-based filtering for non-admin users
    if (currentUser.role !== 'ADMIN') {
      if (currentUser.role === 'SALES_HEAD') {
        // Sales head sees their area and sub-areas
        filteredUsers = filteredUsers.filter(u => 
          u.salesHeadId === currentUser.id || 
          u.areaId === currentUser.areaId ||
          (u.areaId && u.areaId.startsWith(currentUser.areaId))
        );
      } else if (currentUser.role === 'SALES_PERSON') {
        // Sales person sees their assigned dealers
        filteredUsers = filteredUsers.filter(u => 
          u.salesPersonId === currentUser.id || 
          u.areaId === currentUser.areaId
        );
      }
    }

    // Group by area
    const areaMap = {};
    
    filteredUsers.forEach(user => {
      const areaKey = user.areaId || 'area-unassigned';
      const areaName = user.areaName || areas.find(a => a.id === areaKey)?.name || 'Unassigned';
      
      if (!areaMap[areaKey]) {
        areaMap[areaKey] = {
          areaId: areaKey,
          areaName: areaName,
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
        areaId: user.areaId,
        areaName: user.areaName,
        businessName: user.businessName,
        gstin: user.gstin,
        avatar: user.avatar,
        status: user.status || 'ACTIVE',
        salesHeadId: user.salesHeadId,
        salesPersonId: user.salesPersonId
      };
      
      if (user.role === 'SALES_HEAD') {
        areaMap[areaKey].salesHeads.push(userData);
        areaMap[areaKey].totalStaff++;
      } else if (user.role === 'SALES_PERSON') {
        areaMap[areaKey].salesPersons.push(userData);
        areaMap[areaKey].totalStaff++;
      } else if (user.role === 'DEALER') {
        areaMap[areaKey].dealers.push(userData);
        areaMap[areaKey].totalDealers++;
      }
    });
    
    // Sort areas by name and return as array
    return Object.values(areaMap).sort((a, b) => a.areaName.localeCompare(b.areaName));
  }
}

export const dbStore = new DBStore();

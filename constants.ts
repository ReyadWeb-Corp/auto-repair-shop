
import { CustomerType, AppData, Role, InvoiceStatus, InvoiceType, ItemWorkStatus, BusinessType, InventoryCategory, HealthStatus } from './types';

export const INITIAL_DATA: AppData = {
  config: {
    primaryColor: '#7c3aed', 
    primaryColorDark: '#a78bfa',
    themeMode: 'system',
    appName: 'AutoFix Pro',
    appTagline: 'Elite Automotive Service Management',
    businessType: BusinessType.AUTO_REPAIR,
    taxRate: 8.25,
    taxName: 'Sales Tax',
    currency: 'USD',
    currencySymbol: '$',
    businessAddress: '427 Performance Drive, Motor City, MI 48201',
    businessPhone: '(555) 942-1010',
    businessEmail: 'service@autofix-pro.com',
    logoUrl: 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=100&h=100&fit=crop',
    documentFooter: 'All work is guaranteed for 12 months or 12,000 miles, whichever comes first. Thank you for your business!',
    showSpecialistOnInvoice: true,
    autoArchiveYears: 1,
    autoDeleteYears: 4,
    enableAutoCleanup: true,
    allowSelfDeletion: false,
    maxConcurrentJobs: 4, 
    bayCount: 4, 
    minBookingLeadTimeHours: 2,
    businessHours: [
      { day: 'Monday', open: '08:00', close: '18:00', isClosed: false },
      { day: 'Tuesday', open: '08:00', close: '18:00', isClosed: false },
      { day: 'Wednesday', open: '08:00', close: '18:00', isClosed: false },
      { day: 'Thursday', open: '08:00', close: '18:00', isClosed: false },
      { day: 'Friday', open: '08:00', close: '18:00', isClosed: false },
      { day: 'Saturday', open: '09:00', close: '14:00', isClosed: false },
      { day: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
    ]
  },
  users: [
    { id: 'u1', username: 'admin', role: Role.ADMIN, name: 'Alex Rivera' },
    { id: 'u2', username: 'manager', role: Role.MANAGER, name: 'Sarah Chen' },
    { id: 'u3', username: 'staff', role: Role.EMPLOYEE, name: 'Mike Johnson' },
    { id: 'u4', username: 'elena', role: Role.EMPLOYEE, name: 'Elena Rodriguez' }
  ],
  team: [
    {
      id: 'tm1',
      name: 'Alex Rivera',
      title: 'Shop Owner',
      email: 'alex@autofix.com',
      phone: '555-0001',
      role: Role.ADMIN,
      qualifiedServiceIds: ['s1', 's2', 's3', 's4'],
      status: 'active'
    },
    {
      id: 'tm2',
      name: 'Mike Johnson',
      title: 'Master Technician',
      email: 'mike@autofix.com',
      phone: '555-0101',
      role: Role.TECHNICIAN,
      qualifiedServiceIds: ['s1', 's2', 's3'],
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'
    },
    {
      id: 'tm3',
      name: 'Elena Rodriguez',
      title: 'Diagnostic Specialist',
      email: 'elena@autofix.com',
      phone: '555-0102',
      role: Role.SPECIALIST,
      qualifiedServiceIds: ['s3', 's4'],
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
    }
  ],
  customers: [
    { id: 'c1', name: 'James Wilson', email: 'james.w@gmail.com', phone: '555-2233', company: '', title: 'Individual', type: CustomerType.INDIVIDUAL, note: 'Prefers synthetic oil only.', createdAt: '2025-01-15T10:00:00Z' },
    { id: 'c2', name: 'Sarah Miller', email: 'smiller@globex.com', phone: '555-9988', company: 'Globex Corp', title: 'Fleet Manager', type: CustomerType.FLEET, note: 'Authorized for up to $1000 without call.', createdAt: '2025-02-10T09:00:00Z' },
    { id: 'c3', name: 'Robert Downey', email: 'rdj@stark.com', phone: '555-0007', company: 'Stark Industries', title: 'CEO', type: CustomerType.BUSINESS, note: 'White glove service required.', createdAt: '2025-03-01T14:00:00Z' }
  ],
  services: [
    { id: 's1', name: 'Standard Oil Service', description: 'Full synthetic oil change.', price: 89.99, iconName: 'Droplets', isPubliclyBookable: true, estimatedDuration: 45, bufferTime: 15, requiredRole: Role.EMPLOYEE, requiredPartIds: ['p1', 'p2'] },
    { id: 's2', name: 'Brake Pad Replacement', description: 'Ceramic brake pad installation.', price: 250.00, iconName: 'Disc', isPubliclyBookable: true, estimatedDuration: 90, bufferTime: 30, requiredRole: Role.TECHNICIAN, requiredPartIds: ['p3'] },
    { id: 's3', name: 'Engine Diagnostics', description: 'Advanced computer scan and compression test.', price: 180.00, iconName: 'Cpu', isPubliclyBookable: true, estimatedDuration: 60, bufferTime: 0, requiredRole: Role.SPECIALIST },
    { id: 's4', name: 'Electrical Repair', description: 'Troubleshooting harness issues.', price: 150.00, iconName: 'Zap', isPubliclyBookable: false, estimatedDuration: 120, bufferTime: 30, requiredRole: Role.SPECIALIST }
  ],
  parts: [
    { id: 'p1', name: 'Premium Oil Filter', partNumber: 'OF-500-XP', description: 'High-efficiency filter', costPrice: 8.50, price: 15.50, stock: 45, minStockLevel: 10, category: InventoryCategory.PART },
    { id: 'p2', name: 'Synthetic 5W-30 (1L)', partNumber: 'OIL-SY-530', description: 'Synthetic oil', costPrice: 6.99, price: 12.99, stock: 120, minStockLevel: 20, category: InventoryCategory.PART },
    { id: 'p3', name: 'Ceramic Brake Pads', partNumber: 'BP-F-CER', description: 'Performance ceramic pads', costPrice: 42.00, price: 85.00, stock: 12, minStockLevel: 5, category: InventoryCategory.PART }
  ],
  suppliers: [
    { id: 'sup1', name: 'NAPA Auto Parts', contactPerson: 'John NAPA', email: 'orders@napa.com', phone: '555-NAPA', address: '123 Parts Way', category: 'General Parts' }
  ],
  purchaseOrders: [],
  invoices: [
    {
      id: 'inv-1',
      invoiceNumber: 'JOB-9921',
      customerId: 'c1',
      date: '2025-05-20',
      dueDate: '2025-06-20',
      scheduledTime: `${new Date().toISOString().split('T')[0]}T09:00:00`,
      estimatedDuration: 60,
      bayIndex: 0,
      status: InvoiceStatus.PROCESSING,
      type: InvoiceType.INVOICE,
      vehicle: { year: '2022', maker: 'Tesla', model: 'Model 3', color: 'White', version: 'Long Range', licensePlate: 'ELON-1', odoIn: '12400', odoOut: '', vin: '5YJ3E1EB9NF' },
      items: [
        { id: 'li1', type: 'service', referenceId: 's3', description: 'Engine Diagnostics', quantity: 1, unitPrice: 180, total: 180, assignedTeamMemberId: 'tm3', workStatus: ItemWorkStatus.IN_PROGRESS }
      ],
      inspections: [
        { id: 'insp1', category: 'Battery', name: 'Cell Voltage Check', status: HealthStatus.SAFE, finding: 'All cells balanced.', photos: [], evidence: [] }
      ],
      subtotal: 180, taxRate: 0.0825, taxAmount: 14.85, total: 194.85, notes: 'Customer reports minor squeak in dash.', isArchived: false
    },
    {
      id: 'inv-2',
      invoiceNumber: 'JOB-9922',
      customerId: 'c2',
      date: '2025-05-21',
      dueDate: '2025-06-21',
      scheduledTime: `${new Date().toISOString().split('T')[0]}T11:30:00`,
      estimatedDuration: 120,
      bayIndex: 1,
      status: InvoiceStatus.PROCESSING,
      type: InvoiceType.INVOICE,
      vehicle: { year: '2019', maker: 'Ford', model: 'F-150', color: 'Grey', version: 'Lariat', licensePlate: 'WORK-HD', odoIn: '88500', odoOut: '', vin: '1FTRF1C55KF' },
      items: [
        { id: 'li2', type: 'service', referenceId: 's2', description: 'Brake Pad Replacement', quantity: 1, unitPrice: 250, total: 250, assignedTeamMemberId: 'tm2', workStatus: ItemWorkStatus.PENDING },
        { id: 'li3', type: 'part', referenceId: 'p3', description: 'Ceramic Brake Pads', quantity: 1, unitPrice: 85, total: 85 }
      ],
      inspections: [
        { id: 'insp2', category: 'Safety', name: 'Brake Rotor Thickness', status: HealthStatus.DANGER, finding: 'Rotors below min spec (18mm found, 20mm min).', photos: ['https://images.unsplash.com/photo-1486006396123-c77547c674ff?w=400&h=300&fit=crop'], evidence: [{ id: 'ev1', url: 'https://images.unsplash.com/photo-1486006396123-c77547c674ff?w=400&h=300&fit=crop', timestamp: '2025-05-20T10:00:00Z', techId: 'tm2', type: 'finding', label: 'Worn Rotor Evidence' }] }
      ],
      subtotal: 335, taxRate: 0.0825, taxAmount: 27.64, total: 362.64, notes: 'Fleet maintenance cycle.', isArchived: false
    }
  ],
  messages: [],
  notifications: []
};

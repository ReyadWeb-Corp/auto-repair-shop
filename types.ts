
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  TECHNICIAN = 'TECHNICIAN',
  SPECIALIST = 'SPECIALIST'
}

export enum BusinessType {
  GENERAL = 'General Service',
  AUTO_REPAIR = 'Auto Repair Shop',
  HVAC = 'HVAC & Plumbing',
  IT_SERVICES = 'IT & Technical Support'
}

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: Role; 
  qualifiedServiceIds: string[]; 
  imageUrl?: string;
  status: 'active' | 'on-leave' | 'inactive';
}

export interface VehicleInfo {
  year: string;
  maker: string;
  model: string;
  color: string;
  version: string;
  licensePlate: string;
  odoIn: string;
  odoOut: string;
  vin: string;
}

export enum HealthStatus {
  SAFE = 'SAFE',
  MONITOR = 'MONITOR',
  DANGER = 'DANGER'
}

export interface EvidenceMedia {
  id: string;
  url: string;
  timestamp: string;
  techId: string;
  type: 'finding' | 'resolution';
  label?: string;
}

export interface InspectionItem {
  id: string;
  category: string;
  name: string;
  status: HealthStatus;
  finding: string;
  photos: string[]; 
  evidence?: EvidenceMedia[];
  customerDecision?: 'approved' | 'declined' | 'pending';
  estimatedCost?: number;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface RolePermission {
  canSelfDelete: boolean;
  modules: string[];
}

export interface AppConfig {
  primaryColor: string;
  primaryColorDark: string;
  themeMode: 'light' | 'dark' | 'system';
  faviconUrl?: string;
  appName: string;
  appTagline?: string;
  logoUrl?: string;
  businessType: BusinessType;
  signatureUrl?: string;
  documentFooter?: string;
  showSpecialistOnInvoice: boolean;
  taxRate: number;
  taxName: string; 
  currency: string;
  currencySymbol: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  autoArchiveYears: number;
  autoDeleteYears: number;
  enableAutoCleanup: boolean;
  allowSelfDeletion: boolean;
  rolePermissions?: Record<Role, RolePermission>;
  businessHours: BusinessHours[];
  maxConcurrentJobs: number; 
  bayCount: number; // Configurable garage floor size
  minBookingLeadTimeHours: number;
}

export enum CustomerType {
  INDIVIDUAL = 'Individual',
  FLEET = 'Fleet',
  BUSINESS = 'Business'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  type: CustomerType;
  note: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName?: string;
  isPubliclyBookable: boolean;
  estimatedDuration: number; 
  bufferTime: number; 
  requiredRole: Role; 
  requiredPartIds?: string[]; 
}

export enum InventoryCategory {
  PART = 'Part',
  PRODUCT = 'Product',
  SUPPLY = 'Supply'
}

export interface PartItem {
  id: string;
  name: string;
  partNumber: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  minStockLevel: number;
  category: InventoryCategory;
  supplierId?: string;
  imageUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
}

export enum PurchaseStatus {
  DRAFT = 'Draft',
  ORDERED = 'Ordered',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled'
}

export interface PurchaseItem {
  partId: string;
  quantity: number;
  costAtPurchase: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  date: string;
  status: PurchaseStatus;
  items: PurchaseItem[];
  totalAmount: number;
  notes: string;
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  POSTED = 'Posted',
  PROCESSING = 'Processing',
  DONE = 'Done',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
  ARCHIVED = 'Archived'
}

export enum ItemWorkStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  BLOCKED = 'Blocked'
}

export enum InvoiceType {
  ESTIMATE = 'Estimate',
  INVOICE = 'Invoice'
}

export interface InvoiceLineItem {
  id: string;
  type: 'service' | 'part';
  referenceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  assignedTeamMemberId?: string;
  workStatus?: ItemWorkStatus;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'system' | 'billing' | 'work' | 'schedule' | 'issue';
  link?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  channelId?: string; 
  receiverId?: string; 
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'job_tag' | 'ai';
  jobId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  date: string; 
  dueDate: string;
  archivedAt?: string; 
  scheduledTime?: string;
  scheduledEndTime?: string; // New: End time of the bay slot
  estimatedDuration?: number;
  bayIndex?: number; // Specific bay assignment
  status: InvoiceStatus;
  type: InvoiceType;
  vehicle?: VehicleInfo;
  items: InvoiceLineItem[];
  inspections?: InspectionItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  aiSummary?: string;
  isArchived: boolean;
  guestToken?: string;
}

export interface AppData {
  customers: Customer[];
  services: ServiceItem[];
  parts: PartItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  users: User[];
  team: TeamMember[];
  config: AppConfig;
  notifications: Notification[];
  messages: ChatMessage[];
}

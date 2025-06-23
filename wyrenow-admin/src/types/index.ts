export interface Admin {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'super_admin' | 'admin';
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Package {
  id: string;
  name: string;
  description?: string;
  pv: number;
  priceNGN: number;
  priceGHS: number;
  bottles: number;
  type: 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'inactive';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  pvRate: number;
  status: 'active' | 'inactive';
  regions: Region[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  countryId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalPackages: number;
  activePackages: number;
  totalCountries: number;
  totalRegions: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'package_created' | 'package_updated' | 'country_created' | 'region_added';
  description: string;
  timestamp: Date;
  adminName: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'toggle';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}
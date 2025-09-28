// Common type definitions to eliminate duplicate interfaces

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Institution extends BaseEntity {
  name: string;
  type?: string;
  affiliatedBoard?: string;
  email?: string;
  phone?: string;
  yearOfEstablishment?: string;
  approvalStatus?: 'APPROVED' | 'PENDING';
  address?: string;
  totalStudentStrength?: number;
}

export interface Standard extends BaseEntity {
  name: string;
  institutionId: string;
  sections?: Section[];
}

export interface Section extends BaseEntity {
  name: string;
  standardId: string;
  standard?: Standard;
}

export interface Student extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  alternatePhone?: string;
  photoUrl?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  institutionId: string;
  standardId: string;
  sectionId: string;
  institution: Institution;
  standard: Standard;
  studentSection: Section;
  class?: string;
  section?: string;
}

export interface FormState {
  loading: boolean;
  error: string;
  success: string;
}

export interface SearchFilters {
  searchTerm: string;
  currentPage: number;
}

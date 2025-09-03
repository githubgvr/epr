// Organization types (matching backend model)
export interface Organization {
  orgId: number
  orgName: string
  orgTypeId: number
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface CreateOrganizationDto {
  orgName: string
  orgTypeId: number
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> {
  orgId: number
}

// Organization Type
export interface OrgType {
  orgTypeId: number
  orgTypeName: string
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

// Company Profile types
export interface CompanyProfile {
  companyprofileId: number
  companyName: string
  companyRegisteredName: string
  registeredId: string
  industryId: number
  companyProfileDetails: string
  orgId: number
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface CreateCompanyProfileDto {
  companyName: string
  companyRegisteredName: string
  registeredId: string
  industryId: number
  companyProfileDetails: string
  orgId: number
}

export interface UpdateCompanyProfileDto extends Partial<CreateCompanyProfileDto> {
  companyprofileId: number
}

// Account types
export interface Account {
  accountId: number
  accountName: string
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

export interface CreateAccountDto {
  accountName: string
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {
  accountId: number
}

// Industry types
export interface Industry {
  industryId: number
  industryName: string
  createdBy: number
  updatedBy: number
  createdDate: string
  updatedDate: string
  isActive: boolean
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

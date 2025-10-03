/**
 * Centralized message configuration for validation, errors, and success messages
 */

export const ValidationMessages = {
  // Common validation messages
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_NUMBER: 'Must be a valid number',
  POSITIVE_NUMBER: 'Must be a positive number',
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be at most ${max}`,
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  RANGE: (min: number, max: number) => `Must be between ${min} and ${max}`,
  
  // Product Group validation
  PRODUCT_GROUP_NAME_REQUIRED: 'Product group name is required',
  PRODUCT_GROUP_CODE_REQUIRED: 'Product group code is required',
  PRODUCT_GROUP_SORT_ORDER_MIN: 'Sort order must be at least 1',
  
  // Product Category validation
  PRODUCT_CATEGORY_NAME_REQUIRED: 'Product category name is required',
  PRODUCT_CATEGORY_GROUP_REQUIRED: 'Product group is required',
  PRODUCT_CATEGORY_SORT_ORDER_MIN: 'Sort order must be at least 1',
  
  // Product Type validation
  PRODUCT_TYPE_NAME_REQUIRED: 'Product type name is required',
  PRODUCT_TYPE_CATEGORY_REQUIRED: 'Product category is required',
  PRODUCT_TYPE_SORT_ORDER_MIN: 'Sort order must be at least 1',
  
  // Material validation
  MATERIAL_NAME_REQUIRED: 'Material name is required',
  MATERIAL_CODE_REQUIRED: 'Material code is required',
  MATERIAL_SORT_ORDER_MIN: 'Sort order must be at least 1',
  
  // Component validation
  COMPONENT_NAME_REQUIRED: 'Component name is required',
  COMPONENT_CODE_REQUIRED: 'Component code is required',
  COMPONENT_SORT_ORDER_MIN: 'Sort order must be at least 1',
  
  // Material Composition validation
  MATERIAL_ID_REQUIRED: 'Material is required',
  WEIGHT_REQUIRED: 'Weight is required',
  WEIGHT_POSITIVE: 'Weight must be greater than 0',
  PERCENTAGE_REQUIRED: 'Percentage is required',
  PERCENTAGE_RANGE: 'Percentage must be between 0 and 100',
  MIN_PERCENTAGE_REQUIRED: 'Minimum percentage is required',
  MAX_PERCENTAGE_REQUIRED: 'Maximum percentage is required',
  MIN_MAX_PERCENTAGE_INVALID: 'Minimum percentage must be less than or equal to maximum percentage',
};

export const ErrorMessages = {
  // HTTP Error codes
  ERROR_400: 'Bad Request - Invalid data provided',
  ERROR_401: 'Unauthorized - Please login again',
  ERROR_403: 'Forbidden - You do not have permission to perform this action',
  ERROR_404: 'Not Found - The requested resource was not found',
  ERROR_409: 'Conflict - A record with this information already exists',
  ERROR_500: 'Internal Server Error - Please try again later',
  ERROR_503: 'Service Unavailable - Please try again later',
  
  // Generic errors
  NETWORK_ERROR: 'Network error - Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  
  // Operation errors
  LOAD_FAILED: (entity: string) => `Failed to load ${entity}`,
  CREATE_FAILED: (entity: string) => `Failed to create ${entity}`,
  UPDATE_FAILED: (entity: string) => `Failed to update ${entity}`,
  DELETE_FAILED: (entity: string) => `Failed to delete ${entity}`,
  MARK_INACTIVE_FAILED: (entity: string) => `Failed to mark ${entity} as inactive`,
  RESTORE_FAILED: (entity: string) => `Failed to restore ${entity}`,
  
  // Specific entity errors
  PRODUCT_GROUP_EXISTS: 'A product group with this name already exists',
  PRODUCT_CATEGORY_EXISTS: 'A product category with this name already exists',
  PRODUCT_TYPE_EXISTS: 'A product type with this name already exists',
  MATERIAL_EXISTS: 'A material with this code already exists',
  COMPONENT_EXISTS: 'A component with this code already exists',
};

export const SuccessMessages = {
  // Generic success messages
  CREATED: (entity: string) => `${entity} created successfully`,
  UPDATED: (entity: string) => `${entity} updated successfully`,
  DELETED: (entity: string) => `${entity} deleted successfully`,
  MARKED_INACTIVE: (entity: string) => `${entity} marked as inactive successfully`,
  RESTORED: (entity: string) => `${entity} restored successfully`,
  
  // Specific entity success messages
  PRODUCT_GROUP_CREATED: 'Product group created successfully',
  PRODUCT_GROUP_UPDATED: 'Product group updated successfully',
  PRODUCT_GROUP_DELETED: 'Product group deleted successfully',
  PRODUCT_GROUP_INACTIVE: 'Product group marked as inactive successfully',
  PRODUCT_GROUP_RESTORED: 'Product group restored successfully',
  
  PRODUCT_CATEGORY_CREATED: 'Product category created successfully',
  PRODUCT_CATEGORY_UPDATED: 'Product category updated successfully',
  PRODUCT_CATEGORY_DELETED: 'Product category deleted successfully',
  PRODUCT_CATEGORY_INACTIVE: 'Product category marked as inactive successfully',
  PRODUCT_CATEGORY_RESTORED: 'Product category restored successfully',
  
  PRODUCT_TYPE_CREATED: 'Product type created successfully',
  PRODUCT_TYPE_UPDATED: 'Product type updated successfully',
  PRODUCT_TYPE_DELETED: 'Product type deleted successfully',
  PRODUCT_TYPE_INACTIVE: 'Product type marked as inactive successfully',
  PRODUCT_TYPE_RESTORED: 'Product type restored successfully',
  
  MATERIAL_CREATED: 'Material created successfully',
  MATERIAL_UPDATED: 'Material updated successfully',
  MATERIAL_DELETED: 'Material deleted successfully',
  MATERIAL_INACTIVE: 'Material marked as inactive successfully',
  MATERIAL_RESTORED: 'Material restored successfully',
  
  COMPONENT_CREATED: 'Component created successfully',
  COMPONENT_UPDATED: 'Component updated successfully',
  COMPONENT_DELETED: 'Component deleted successfully',
  COMPONENT_INACTIVE: 'Component marked as inactive successfully',
  COMPONENT_RESTORED: 'Component restored successfully',
};

export const ConfirmMessages = {
  // Delete confirmations
  CONFIRM_DELETE: (entity: string, name: string) => `Are you sure you want to delete "${name}"?`,
  CONFIRM_MARK_INACTIVE: (entity: string, name: string) => `Are you sure you want to mark "${name}" as inactive?`,
  CONFIRM_RESTORE: (entity: string, name: string) => `Are you sure you want to restore "${name}"?`,
};

/**
 * Helper function to get error message from HTTP status code
 */
export const getErrorMessageFromStatus = (status: number, defaultMessage?: string): string => {
  switch (status) {
    case 400:
      return ErrorMessages.ERROR_400;
    case 401:
      return ErrorMessages.ERROR_401;
    case 403:
      return ErrorMessages.ERROR_403;
    case 404:
      return ErrorMessages.ERROR_404;
    case 409:
      return ErrorMessages.ERROR_409;
    case 500:
      return ErrorMessages.ERROR_500;
    case 503:
      return ErrorMessages.ERROR_503;
    default:
      return defaultMessage || ErrorMessages.UNKNOWN_ERROR;
  }
};

/**
 * Helper function to format error message with error code
 */
export const formatErrorMessage = (status: number, message?: string): string => {
  const errorMessage = message || getErrorMessageFromStatus(status);
  return `Error ${status} - ${errorMessage}`;
};


import { PaperworkTemplate, ValidationResult } from './types';

export const validateTemplateStructure = (template: PaperworkTemplate): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field checks
  if (!template.id?.trim()) errors.push('Template ID is required');
  if (!template.name?.trim()) errors.push('Template name is required');
  if (!template.description?.trim()) errors.push('Template description is required');
  if (!template.category?.trim()) errors.push('Category is required');
  if (!template.template?.trim()) errors.push('Template content is required');
  
  // ID format validation
  if (template.id && !/^[a-z0-9-]+$/.test(template.id)) {
    errors.push('Template ID must contain only lowercase letters, numbers, and hyphens');
  }

  // Fields validation
  if (!template.fields || !Array.isArray(template.fields)) {
    errors.push('Fields must be an array');
  } else {
    // Check for duplicate field names
    const fieldNames = template.fields.map(f => f.name);
    const duplicateNames = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      errors.push(`Duplicate field names: ${duplicateNames.join(', ')}`);
    }

    // Validate each field
    template.fields.forEach((field, index) => {
      const fieldPrefix = `Field "${field.name || 'unnamed'}":`;
      
      if (!field.id?.trim()) errors.push(`${fieldPrefix} Missing ID`);
      if (!field.type?.trim()) errors.push(`${fieldPrefix} Missing type`);
      if (!field.name?.trim()) errors.push(`${fieldPrefix} Missing name`);
      if (!field.label?.trim()) errors.push(`${fieldPrefix} Missing label`);
      
      // Field type validation - SIMPLIFIED
      const validTypes = ['text', 'textarea', 'date', 'select', 'list', 'checkbox'];
      if (field.type && !validTypes.includes(field.type)) {
        errors.push(`${fieldPrefix} Invalid type "${field.type}"`);
      }

      // Select field validation
      if (field.type === 'select' && (!field.options || !Array.isArray(field.options) || field.options.length === 0)) {
        errors.push(`${fieldPrefix} Select fields must have options array with at least one option`);
      }

      // Checkbox validation
      if (field.type === 'checkbox') {
        if (!field.checkedValue?.trim()) {
          warnings.push(`${fieldPrefix} Checkbox fields should have a checkedValue`);
        }
        if (!field.uncheckedValue?.trim()) {
          warnings.push(`${fieldPrefix} Checkbox fields should have an uncheckedValue`);
        }
      }

      // Date validation
      if (field.type === 'date' && !field.dateFormat?.trim()) {
        warnings.push(`${fieldPrefix} Date fields should have a dateFormat`);
      }
    });
  }

  // Check if all placeholders in template have corresponding fields
  const placeholderRegex = /{{(\w+):([^:}]+)(?::([^}]+))?}}/g;
  const placeholders = Array.from(template.template.matchAll(placeholderRegex));
  const fieldNames = template.fields?.map(f => f.name) || [];
  
  placeholders.forEach(match => {
    const fieldName = match[2];
    if (!fieldNames.includes(fieldName)) {
      warnings.push(`Placeholder "{{${match[0]}}" in content has no corresponding field`);
    }
  });

  // Check if all fields have placeholders in content
  template.fields?.forEach(field => {
    const placeholderPattern = `{{${field.type}:${field.name}}}`;
    if (!template.template.includes(placeholderPattern)) {
      warnings.push(`Field "${field.name}" has no placeholder in the template content`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateJSON = (jsonString: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const parsed = JSON.parse(jsonString);
    
    // Basic JSON structure validation
    if (typeof parsed !== 'object' || parsed === null) {
      errors.push('Template must be a valid JSON object');
      return { isValid: false, errors, warnings };
    }

    // Validate against PaperworkTemplate interface
    return validateTemplateStructure(parsed as PaperworkTemplate);
    
  } catch (error) {
    errors.push('Invalid JSON format: ' + (error instanceof Error ? error.message : 'Unknown error'));
    return { isValid: false, errors, warnings };
  }
};

export const exportToCSV = (data: any[], columns: { key: string, label: string }[], filename: string) => {
  if (!data || !data.length) return;
  
  // Create header row
  const header = columns.map(col => `"${col.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      // Handle dates for better formatting
      if (col.key.includes('date') && item[col.key]) {
        const date = new Date(item[col.key]);
        return `"${date.toLocaleDateString()}"`;
      }
      // Handle null or undefined values
      if (item[col.key] === null || item[col.key] === undefined) {
        return `""`;
      }
      // Handle boolean values
      if (typeof item[col.key] === 'boolean') {
        return `"${item[col.key] ? 'Yes' : 'No'}"`;
      }
      // Handle number values
      if (typeof item[col.key] === 'number') {
        return `"${item[col.key]}"`;
      }
      // Handle objects (like nested data)
      if (typeof item[col.key] === 'object' && item[col.key] !== null) {
        // For objects, extract a display name or convert to JSON string
        if (item[col.key].name) {
          return `"${item[col.key].name.replace(/"/g, '""')}"`;
        }
        return `"${JSON.stringify(item[col.key]).replace(/"/g, '""')}"`;
      }
      // Handle string values (escape quotes)
      return `"${String(item[col.key] || '').replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  // Combine header and rows
  const csvContent = [header, ...rows].join('\r\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Add a function to prepare data for better export
export const prepareDataForExport = (data: any[], config: { 
  dateFields?: string[], 
  relationFields?: {[key: string]: string},
  calculatedFields?: {[key: string]: (item: any) => any}
}) => {
  return data.map(item => {
    const result = {...item};
    
    // Format date fields
    if (config.dateFields) {
      config.dateFields.forEach(field => {
        if (item[field]) {
          const date = new Date(item[field]);
          if (isNaN(date.getTime())) {
            result[field] = item[field];
          } else {
            result[field] = date.toLocaleDateString();
          }
        }
      });
    }
    
    // Handle relation fields (convert objects to their names)
    if (config.relationFields) {
      Object.entries(config.relationFields).forEach(([field, nameField]) => {
        if (item[field] && typeof item[field] === 'object') {
          result[field] = item[field][nameField] || '(unknown)';
        }
      });
    }
    
    // Add calculated fields
    if (config.calculatedFields) {
      Object.entries(config.calculatedFields).forEach(([field, calcFn]) => {
        result[field] = calcFn(item);
      });
    }
    
    return result;
  });
};

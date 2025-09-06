import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Company } from '../types';

export const exportToExcel = (companies: Company[], filename: string = 'internship-companies') => {
  const worksheet = XLSX.utils.json_to_sheet(
    companies.map((company, index) => ({
      'No.': index + 1,
      'Company Name': company.name,
      'Address': company.address,
      'Phone': company.phone || 'N/A',
      'Email': company.email || 'N/A',
      'Website': company.website || 'N/A',
      'Category': company.category,
      'Rating': company.rating ? `${company.rating}/5` : 'N/A',
      'Business Status': company.businessStatus || 'N/A',
      'Coordinates': `${company.lat}, ${company.lng}`
    }))
  );

  // Set column widths
  const colWidths = [
    { wch: 5 },   // No.
    { wch: 30 },  // Company Name
    { wch: 40 },  // Address
    { wch: 15 },  // Phone
    { wch: 25 },  // Email
    { wch: 30 },  // Website
    { wch: 20 },  // Category
    { wch: 10 },  // Rating
    { wch: 15 },  // Business Status
    { wch: 20 }   // Coordinates
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(data, `${filename}.xlsx`);
};

export const exportToCSV = (companies: Company[], filename: string = 'internship-companies') => {
  const csvData = companies.map((company, index) => ({
    'No.': index + 1,
    'Company Name': company.name,
    'Address': company.address,
    'Phone': company.phone || 'N/A',
    'Email': company.email || 'N/A',
    'Website': company.website || 'N/A',
    'Category': company.category,
    'Rating': company.rating ? `${company.rating}/5` : 'N/A',
    'Business Status': company.businessStatus || 'N/A',
    'Coordinates': `${company.lat}, ${company.lng}`
  }));

  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const generateFileName = (location: string, skills: string[]): string => {
  const cleanLocation = location.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const cleanSkills = skills.length > 0 
    ? skills.map(skill => skill.replace(/[^a-zA-Z0-9]/g, '-')).join('-').toLowerCase()
    : 'all-skills';
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `internships-${cleanLocation}-${cleanSkills}-${timestamp}`;
};
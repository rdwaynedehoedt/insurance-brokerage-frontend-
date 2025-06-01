import { useState, useEffect } from 'react';
import { Client } from '@/lib/services/clients';
import { Download, Eye, FileText, Folder, FolderOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DirectDocumentViewer from './DirectDocumentViewer';

interface DocumentItem {
  label: string;
  fieldName: string;
  category: string;
  url: string | null;
  fileName: string | null;
}

interface ClientDocumentsProps {
  client: Client;
}

export default function ClientDocuments({ client }: ClientDocumentsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>('Policy Documents'); // Open first category by default
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [documentFields, setDocumentFields] = useState<Record<string, string | null>>({});
  
  // Debug: Log client object to see if document fields are present
  console.log('ClientDocuments: Client data:', client);

  // Initialize and process document fields when client changes
  useEffect(() => {
    if (!client) return;

    // Map of all possible document field names and their possible alternative names
    const fieldMappings: Record<string, string | undefined> = {
      'coverage_proof': undefined,
      'sum_insured_proof': undefined,
      'policy_fee_invoice': undefined,
      'vat_debit_note': undefined,
      'payment_receipt': undefined,
      'nic_proof': undefined,
      'dob_proof': undefined,
      'business_registration_proof': 'business_registration',
      'svat_proof': undefined,
      'vat_proof': undefined
    };

    // Process all document fields and store their values
    const processedFields: Record<string, string | null> = {};
    
    Object.entries(fieldMappings).forEach(([fieldName, altFieldName]) => {
      // Check primary field name
      if (client[fieldName as keyof typeof client]) {
        const url = client[fieldName as keyof typeof client] as string;
        processedFields[fieldName] = url;
        console.log(`Found document URL for ${fieldName}:`, url);
      } 
      // Check alternative field name if provided
      else if (altFieldName && client[altFieldName as keyof typeof client]) {
        const url = client[altFieldName as keyof typeof client] as string;
        processedFields[fieldName] = url;
        console.log(`Found document URL for ${fieldName} using alt ${altFieldName}:`, url);
      } else {
        processedFields[fieldName] = null;
        console.log(`No document URL found for ${fieldName}${altFieldName ? ` or ${altFieldName}` : ''}`);
      }
    });
    
    setDocumentFields(processedFields);
    
    // Log all document URLs to help with debugging
    console.log('All client data:', client);
    console.log('All document fields extracted:', processedFields);
  }, [client]);
  
  // Helper to get document URL from the processed fields
  const getDocumentUrl = (fieldName: string, altFieldName?: string): string | null => {
    if (documentFields[fieldName]) {
      return documentFields[fieldName];
    }
    return null;
  };
  
  // Organize documents by category
  const documentCategories = [
    {
      name: 'Policy Documents',
      documents: [
        {
          label: 'Coverage Proof',
          fieldName: 'coverage_proof',
          category: 'Policy Documents',
          url: getDocumentUrl('coverage_proof'),
          fileName: getDocumentUrl('coverage_proof') ? extractFileName(getDocumentUrl('coverage_proof')!) : null
        },
        {
          label: 'Sum Insured Proof',
          fieldName: 'sum_insured_proof',
          category: 'Policy Documents',
          url: getDocumentUrl('sum_insured_proof'),
          fileName: getDocumentUrl('sum_insured_proof') ? extractFileName(getDocumentUrl('sum_insured_proof')!) : null
        },
        {
          label: 'Policy Fee Invoice',
          fieldName: 'policy_fee_invoice',
          category: 'Policy Documents',
          url: getDocumentUrl('policy_fee_invoice'),
          fileName: getDocumentUrl('policy_fee_invoice') ? extractFileName(getDocumentUrl('policy_fee_invoice')!) : null
        },
        {
          label: 'VAT Debit Note',
          fieldName: 'vat_debit_note',
          category: 'Policy Documents',
          url: getDocumentUrl('vat_debit_note'),
          fileName: getDocumentUrl('vat_debit_note') ? extractFileName(getDocumentUrl('vat_debit_note')!) : null
        },
        {
          label: 'Payment Receipt',
          fieldName: 'payment_receipt',
          category: 'Policy Documents',
          url: getDocumentUrl('payment_receipt'),
          fileName: getDocumentUrl('payment_receipt') ? extractFileName(getDocumentUrl('payment_receipt')!) : null
        }
      ]
    },
    {
      name: 'Identity Documents',
      documents: [
        {
          label: 'NIC Proof',
          fieldName: 'nic_proof',
          category: 'Identity Documents',
          url: getDocumentUrl('nic_proof'),
          fileName: getDocumentUrl('nic_proof') ? extractFileName(getDocumentUrl('nic_proof')!) : null
        },
        {
          label: 'DOB Proof',
          fieldName: 'dob_proof',
          category: 'Identity Documents',
          url: getDocumentUrl('dob_proof'),
          fileName: getDocumentUrl('dob_proof') ? extractFileName(getDocumentUrl('dob_proof')!) : null
        }
      ]
    },
    {
      name: 'Business Documents',
      documents: [
        {
          label: 'Business Registration',
          fieldName: 'business_registration_proof',
          category: 'Business Documents',
          url: getDocumentUrl('business_registration_proof'),
          fileName: getDocumentUrl('business_registration_proof') ? extractFileName(getDocumentUrl('business_registration_proof')!) : null
        },
        {
          label: 'SVAT Proof',
          fieldName: 'svat_proof',
          category: 'Business Documents',
          url: getDocumentUrl('svat_proof'),
          fileName: getDocumentUrl('svat_proof') ? extractFileName(getDocumentUrl('svat_proof')!) : null
        },
        {
          label: 'VAT Proof',
          fieldName: 'vat_proof',
          category: 'Business Documents',
          url: getDocumentUrl('vat_proof'),
          fileName: getDocumentUrl('vat_proof') ? extractFileName(getDocumentUrl('vat_proof')!) : null
        }
      ]
    }
  ];

  // Debug: Log document categories to see what URLs are detected
  console.log('Document Categories:', documentCategories.map(cat => ({
    name: cat.name,
    documents: cat.documents.map(doc => ({
      label: doc.label,
      url: doc.url,
      fileName: doc.fileName
    }))
  })));

  const totalDocuments = documentCategories.reduce((total, category) => {
    const uploadedDocs = category.documents.filter(doc => doc.url !== null).length;
    return total + uploadedDocs;
  }, 0);

  // Debug: Log total documents count
  console.log('Total documents:', totalDocuments);

  function extractFileName(url: string): string {
    // Extract filename from URL
    try {
      const parts = url.split('/');
      return parts[parts.length - 1];
    } catch (error) {
      console.error('Error extracting filename from URL:', url, error);
      return 'unknown-file';
    }
  }

  function getDocumentIcon(url: string | null) {
    if (!url) return null;
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
  }

  function parseDocumentUrl(url: string): { clientId: string, filename: string } | null {
    if (!url) return null;
    
    try {
      console.log('Parsing document URL:', url);
      
      // Normalize URL by ensuring it has the proper /uploads prefix
      let normalizedUrl = url;
      if (url.startsWith('/documents/') && !url.startsWith('/uploads/documents/')) {
        normalizedUrl = `/uploads${url}`;
        console.log('Normalized URL by adding uploads prefix:', normalizedUrl);
      }
      
      // Handle temporary client IDs (example: /uploads/documents/temp-00a3c650-a706-47ab-8224-2434bdc06d64/filename.jpg)
      // This is critical as the files are often stored with temp IDs
      const tempIdMatch = normalizedUrl.match(/\/uploads\/documents\/(temp-[a-f0-9-]+)\/([^\/]+)$/i);
      if (tempIdMatch && tempIdMatch.length === 3) {
        console.log('Found temp client ID:', {
          clientId: tempIdMatch[1],
          filename: tempIdMatch[2]
        });
        return {
          clientId: tempIdMatch[1],
          filename: tempIdMatch[2]
        };
      }
      
      // Standard path format: /uploads/documents/client-id/filename
      const standardMatch = normalizedUrl.match(/\/uploads\/documents\/([^\/]+)\/([^\/]+)$/);
      if (standardMatch && standardMatch.length === 3) {
        console.log('Standard document path:', {
          clientId: standardMatch[1],
          filename: standardMatch[2]
        });
        return {
          clientId: standardMatch[1],
          filename: standardMatch[2]
        };
      } 
      
      // Handle direct document paths without uploads prefix
      const directDocMatch = normalizedUrl.match(/\/documents\/([^\/]+)\/([^\/]+)$/);
      if (directDocMatch && directDocMatch.length === 3) {
        console.log('Direct document path (missing uploads prefix):', {
          clientId: directDocMatch[1],
          filename: directDocMatch[2]
        });
        return {
          clientId: directDocMatch[1],
          filename: directDocMatch[2]
        };
      }
      
      // Handle root document directory paths
      const rootDocMatch = normalizedUrl.match(/\/uploads\/documents\/([^\/]+)$/);
      if (rootDocMatch && rootDocMatch.length === 2 && client?.id) {
        const filename = rootDocMatch[1];
        console.log('Root document path:', {
          clientId: client.id,
          filename
        });
        return {
          clientId: client.id as string,
          filename
        };
      }
      
      // If we have a client ID from props, use that with the filename
      const lastSlashIndex = normalizedUrl.lastIndexOf('/');
      if (lastSlashIndex !== -1 && client?.id) {
        const filename = normalizedUrl.substring(lastSlashIndex + 1);
        console.log('Using client ID from props with filename:', {
          clientId: client.id,
          filename
        });
        return {
          clientId: client.id as string,
          filename
        };
      }
      
      // Last resort: Try to extract the filename and use it with the client ID
      // This is a fallback when URL doesn't match expected patterns
      const filename = extractFileName(normalizedUrl);
      if (filename && client?.id) {
        console.log('Last resort with client ID and filename:', {
          clientId: client.id,
          filename
        });
        return {
          clientId: client.id as string,
          filename
        };
      }
      
      console.error('Failed to parse document URL:', url);
      return null;
    } catch (error) {
      console.error('Error parsing document URL:', error);
      return null;
    }
  }

  function getDocumentDirectUrl(url: string): string {
    if (!url) return '';
    
    // Get base URL without /api
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
    
    try {
      // For direct access to a static file in uploads directory
      if (url.startsWith('/uploads/')) {
        const directUrl = `${baseUrl}${url}`;
        console.log('Direct static file URL:', directUrl);
        return directUrl;
      }
      
      // If URL is already a full URL, return it
      if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('URL is already complete:', url);
        return url;
      }
      
      // Fix for paths that are missing the /uploads prefix
      if (url.startsWith('/documents/')) {
        const correctedUrl = `/uploads${url}`;
        console.log('Corrected document path:', correctedUrl);
        return `${baseUrl}${correctedUrl}`;
      }
      
      // Ensure proper formatting with leading slash and uploads prefix if needed
      let formattedUrl = url.startsWith('/') ? url : `/${url}`;
      // If it doesn't include uploads but looks like a document path, add the uploads prefix
      if (!formattedUrl.includes('/uploads/') && 
          (formattedUrl.includes('/documents/') || 
           formattedUrl.includes('temp-'))) {
        formattedUrl = `/uploads${formattedUrl}`;
        console.log('Added uploads prefix to path:', formattedUrl);
      }
      
      const fullUrl = `${baseUrl}${formattedUrl}`;
      console.log('Formatted URL:', fullUrl);
      return fullUrl;
    } catch (error) {
      console.error('Error creating direct URL:', error);
      // More robust fallback to ensure uploads prefix
      let fixedUrl = url;
      if (!fixedUrl.includes('/uploads/') && fixedUrl.includes('/documents/')) {
        fixedUrl = `/uploads${fixedUrl.startsWith('/') ? '' : '/'}${fixedUrl}`;
      }
      return `${baseUrl}${fixedUrl.startsWith('/') ? '' : '/'}${fixedUrl}`;
    }
  }

  // Function to attempt multiple access methods for a document
  async function tryAccessDocument(url: string): Promise<{success: boolean, url: string, method: string}> {
    if (!url) return { success: false, url: '', method: 'none' };
    
    try {
      // Method 1: Try direct URL first
      const directUrl = getDocumentDirectUrl(url);
      try {
        const response = await fetch(directUrl, { method: 'HEAD' });
        if (response.ok) {
          return { success: true, url: directUrl, method: 'direct' };
        }
      } catch (error) {
        console.log('Direct access failed:', error);
      }
      
      // Method 2: Try API endpoint
      const urlInfo = parseDocumentUrl(url);
      if (urlInfo) {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
        const apiUrl = `${baseUrl}/api/clients/${urlInfo.clientId}/documents/${urlInfo.filename}`;
        
        try {
          const response = await fetch(apiUrl, { method: 'HEAD' });
          if (response.ok) {
            return { success: true, url: apiUrl, method: 'api' };
          }
        } catch (error) {
          console.log('API access failed:', error);
        }
      }
      
      // Method 3: Try file checker API
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
        const testUrl = `${baseUrl}/api/test-file-access?path=${encodeURIComponent(url)}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (data.success) {
          return { success: true, url: directUrl, method: 'test-api-verified' };
        }
      } catch (error) {
        console.log('File checker API failed:', error);
      }
      
      // All methods failed
      return { success: false, url, method: 'all-failed' };
    } catch (error) {
      console.error('Error accessing document:', error);
      return { success: false, url, method: 'error' };
    }
  }

  function downloadDocument(url: string, fileName: string) {
    if (!url) {
      toast.error('No document URL provided');
      return;
    }
    
    try {
      console.log('Starting document download:', url);
      toast.loading('Preparing download...');
      
      // Get base URL without /api
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
      
      // Parse the document URL to extract client ID and filename
      const urlInfo = parseDocumentUrl(url);
      
      if (!urlInfo) {
        console.error('Could not parse document URL for download:', url);
        toast.dismiss();
        toast.error('Failed to download: Invalid document path');
        return;
      }
      
      // Create download URL through the API endpoint
      const downloadUrl = `${baseUrl}/api/clients/${urlInfo.clientId}/documents/${urlInfo.filename}/download`;
      console.log('Using API download URL:', downloadUrl);
      
      // Add auth token to the link for secure download
      const token = localStorage.getItem('auth_token');
      const finalUrl = token ? `${downloadUrl}?token=${token}` : downloadUrl;
      
      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = finalUrl;
      link.setAttribute('download', fileName || urlInfo.filename || 'document');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      
      // Trigger the download and clean up
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        toast.dismiss();
        toast.success('Download started');
      }, 100);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.dismiss();
      toast.error('Failed to download document');
      
      // Last resort fallback - try direct window open
      try {
        const directUrl = getDocumentDirectUrl(url);
        window.open(directUrl, '_blank');
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
      }
    }
  }

  function getDocumentViewUrl(url: string): string {
    if (!url) return '';
    
    // Get base URL without /api
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
    
    try {
      console.log('Getting view URL for:', url);
      
      // For direct access to a static file in uploads directory
      if (url.startsWith('/uploads/')) {
        // Try direct URL first (static file access)
        const directUrl = `${baseUrl}${url}`;
        console.log('Direct static file URL:', directUrl);
        return directUrl;
      }
      
      // Try parsing the URL to use the API endpoint
      const urlInfo = parseDocumentUrl(url);
      console.log('View parsed URL info:', urlInfo);
      
      if (!urlInfo) {
        console.error('Could not parse document URL for viewing:', url);
        // Fallback to direct URL
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      
      // Create view URL through the API endpoint
      const viewUrl = `${baseUrl}/api/clients/${urlInfo.clientId}/documents/${urlInfo.filename}`;
      console.log('Created API view URL:', viewUrl);
      
      // Add auth token to the URL for secure viewing
      const token = localStorage.getItem('auth_token');
      if (token) {
        const separator = viewUrl.includes('?') ? '&' : '?';
        return `${viewUrl}${separator}token=${token}`;
      }
      
      return viewUrl;
    } catch (error) {
      console.error('Error creating view URL:', error);
      // Fallback to direct URL
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
  }

  // Add a function to open the document in a new window
  async function openDocumentInNewWindow(doc: DocumentItem) {
    if (!doc.url) {
      toast.error('Document URL is missing');
      return;
    }
    
    try {
      toast.loading('Checking document access...');
      
      // Try different methods to access the document
      const accessResult = await tryAccessDocument(doc.url);
      
      toast.dismiss();
      
      if (accessResult.success) {
        console.log(`Opening document using ${accessResult.method} method:`, accessResult.url);
        window.open(accessResult.url, '_blank');
        toast.success(`Document opened with ${accessResult.method} method`);
      } else {
        console.error('All document access methods failed');
        toast.error('Could not access document');
        
        // Show available debugging info
        console.log('Document details:', {
          url: doc.url,
          label: doc.label,
          fileName: doc.fileName
        });
        
        // Fallback - try direct URL anyway as last resort
        const directUrl = getDocumentDirectUrl(doc.url);
        if (confirm('Document access failed. Try direct URL as last resort?')) {
          window.open(directUrl, '_blank');
        }
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error opening document in new window:', error);
      toast.error('Failed to open document');
    }
  }

  // Add diagnostic function for troubleshooting document access
  async function testDocumentAccess(doc: DocumentItem) {
    if (!doc.url) {
      console.error('Cannot test document access: URL is missing');
      return;
    }

    console.log('----------- DOCUMENT ACCESS TEST -----------');
    console.log('Document:', doc);
    
    // Test 1: Original URL
    console.log('\nTest 1: Original URL');
    console.log('URL:', doc.url);
    
    // Test 2: With uploads prefix
    console.log('\nTest 2: With uploads prefix');
    const withUploadsPrefix = doc.url.startsWith('/uploads/') ? doc.url : `/uploads${doc.url.startsWith('/') ? doc.url : `/${doc.url}`}`;
    console.log('URL:', withUploadsPrefix);
    
    // Test 3: Direct URL
    console.log('\nTest 3: Direct URL');
    const directUrl = getDocumentDirectUrl(doc.url);
    console.log('URL:', directUrl);
    
    // Test 4: Document parsed info
    console.log('\nTest 4: Document parsed info');
    const parsedInfo = parseDocumentUrl(doc.url);
    console.log('Parsed info:', parsedInfo);
    
    // Test 5: API access info
    if (parsedInfo) {
      console.log('\nTest 5: API access info');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
      const apiUrl = `${baseUrl}/api/clients/${parsedInfo.clientId}/documents/${parsedInfo.filename}`;
      console.log('API URL:', apiUrl);
    }
    
    // Test 6: File test access endpoint
    try {
      console.log('\nTest 6: File test access endpoint');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      const testUrl = `${baseUrl}/api/test-file-access?path=${encodeURIComponent(doc.url)}`;
      console.log('Testing URL:', testUrl);
      
      const response = await fetch(testUrl);
      const data = await response.json();
      console.log('Test result:', data);
    } catch (error) {
      console.error('File test access error:', error);
    }
    
    console.log('----------- END OF TEST -----------');
  }

  // Update the viewDocument function to use testDocumentAccess when needed
  async function viewDocument(doc: DocumentItem) {
    if (!doc.url) {
      toast.error('Document URL is missing');
      return;
    }
    
    // Try to determine if it's a PDF or image first
    const lowerUrl = doc.url.toLowerCase();
    if (lowerUrl.endsWith('.pdf')) {
      // For PDFs, prefer opening in a new window
      await openDocumentInNewWindow(doc);
      return;
    }
    
    // For images, show loading state
    toast.loading('Preparing document for preview...');
    
    // Run diagnostic test if URL looks problematic
    if (doc.url.includes('/documents/') && !doc.url.includes('/uploads/documents/')) {
      console.log('Running document access diagnostic for potentially incorrect path');
      await testDocumentAccess(doc);
    }
    
    // Try to verify document accessibility
    const accessResult = await tryAccessDocument(doc.url);
    toast.dismiss();
    
    if (accessResult.success) {
      // If accessible, show in modal with the working URL
      const updatedDoc = {
        ...doc,
        url: accessResult.url // Use the URL that was verified to work
      };
      setPreviewDoc(updatedDoc);
      console.log(`Document preview using ${accessResult.method} method:`, accessResult.url);
    } else {
      // Run document access test for debugging
      await testDocumentAccess(doc);
      
      // If not accessible, try to open in new window as fallback
      console.warn('Could not prepare document for preview, trying external viewing');
      toast.error('Cannot preview document, attempting external viewer');
      await openDocumentInNewWindow(doc);
    }
  }

  function closePreview() {
    setPreviewDoc(null);
  }

  function toggleCategory(categoryName: string) {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  }
  
  // Check if any documents are available
  const hasDocuments = documentCategories.some(category => 
    category.documents.some(doc => doc.url !== null)
  );

  // Repair all document paths in one operation
  async function repairAllDocuments() {
    try {
      console.log('[Client Documents] Starting document repair for all clients');
      toast.loading('Repairing document paths...');
      
      const response = await fetch('http://localhost:5000/api/repair-all-documents');
      const data = await response.json();
      
      if (data.success) {
        toast.dismiss();
        toast.success(`Fixed ${data.fixedPaths} document paths. Created ${data.createdDirectories} directories.`);
        
        // Reload the client to see the changes
        window.location.reload();
      } else {
        toast.dismiss();
        toast.error('Failed to repair documents: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('[Client Documents] Error repairing documents:', error);
      toast.dismiss();
      toast.error('Failed to repair documents. See console for details.');
    }
  }

  // Add this after the downloadDocument function
  async function getDirectDownloadLink(docInfo: DocumentItem): Promise<string | null> {
    if (!docInfo.url || !client?.id) {
      console.error('Missing document URL or client ID');
      return null;
    }
    
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
      const fieldName = docInfo.fieldName;
      const token = localStorage.getItem('auth_token');
      
      console.log('Getting direct download link with token:', token ? 'Present (not shown)' : 'Missing');
      
      // Check if token exists
      if (!token) {
        console.error('No authentication token found in localStorage');
        toast.error('Authentication error - please try logging in again');
        return null;
      }
      
      // Try using the direct download URL approach first
      const downloadUrl = `${baseUrl}${docInfo.url}`;
      console.log('Using direct file URL as fallback:', downloadUrl);
      return downloadUrl;
      
      /* Commenting out API approach for now and using direct URL
      // Get the direct download link from API
      const response = await fetch(`${baseUrl}/api/clients/${client.id}/documents/${fieldName}/direct-link`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error ${response.status}: ${response.statusText}`);
        // Try using URL directly as fallback
        const downloadUrl = `${baseUrl}${docInfo.url}`;
        console.log('Using direct file URL as fallback:', downloadUrl);
        return downloadUrl;
      }
      
      const data = await response.json();
      
      if (data.success && data.downloadUrl) {
        console.log('Got direct download link:', data.downloadUrl);
        return data.downloadUrl;
      } else {
        console.error('Error in download link response:', data);
        return null;
      }
      */
    } catch (error) {
      console.error('Error getting direct download link:', error);
      
      // Fallback to direct URL approach
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
      const downloadUrl = `${baseUrl}${docInfo.url}`;
      console.log('Using direct file URL as fallback after error:', downloadUrl);
      return downloadUrl;
    }
  }
  
  // Add this helper function to download files using Blob
  async function downloadUsingBlob(url: string, filename: string) {
    try {
      console.log(`Downloading file from ${url} as ${filename}`);
      toast.loading('Downloading file...');
      
      // Add auth token if available and only if it's an API endpoint
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token && url.includes('/api/')) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch the file
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`Download failed: ${response.status} ${response.statusText}`);
        
        // If unauthorized and we have a token, the token might be invalid
        if (response.status === 401 && token) {
          toast.dismiss();
          toast.error('Authentication error - please try logging in again');
          return false;
        }
        
        // For other errors, we'll try a window.open approach instead
        toast.dismiss();
        toast.error('Download failed, trying alternative method...');
        
        // Try direct window.open as a fallback
        window.open(url, '_blank');
        return true;
      }
      
      // Get content type to determine how to handle the response
      const contentType = response.headers.get('content-type') || '';
      
      // Special handling for JSON responses (likely errors)
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        console.error('Server returned JSON instead of file:', jsonData);
        toast.dismiss();
        
        if (jsonData.message) {
          toast.error(`Server error: ${jsonData.message}`);
        } else {
          toast.error('Server returned an error response');
        }
        
        return false;
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // If the blob is too small, it might be an error
      if (blob.size < 100) {
        console.warn('Downloaded file is suspiciously small:', blob.size, 'bytes');
      }
      
      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      
      // Add the link to the document, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      toast.dismiss();
      toast.success('Download complete');
      return true;
    } catch (error) {
      console.error('Error downloading file using Blob:', error);
      toast.dismiss();
      toast.error('Download failed');
      
      // Try window.open as a last resort
      try {
        window.open(url, '_blank');
        return true;
      } catch (e) {
        console.error('Window.open fallback also failed:', e);
        return false;
      }
    }
  }
  
  // Add this new method that combines multiple download techniques
  async function advancedDownload(doc: DocumentItem) {
    if (!doc.url) {
      toast.error('Document URL is missing');
      return;
    }
    
    try {
      // First approach: Try direct URL for simplicity
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
      const directUrl = `${baseUrl}${doc.url}`;
      
      console.log('Attempting download with direct URL:', directUrl);
      
      // Try blob download first (most reliable)
      const blobSuccess = await downloadUsingBlob(directUrl, doc.fileName || 'document');
      if (blobSuccess) {
        console.log('Download completed using Blob method');
        return;
      }
      
      // If blob download failed, try window.open as fallback
      console.log('Blob download failed, trying window.open');
      window.open(directUrl, '_blank');
      
      // No need to try API method right now since it's having authentication issues
    } catch (error) {
      console.error('Advanced download failed:', error);
      toast.error('Download failed, please try again');
      
      // Final fallback - try direct URL in a new tab
      const directUrl = getDocumentDirectUrl(doc.url);
      window.open(directUrl, '_blank');
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Client Documents</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            {totalDocuments} document{totalDocuments !== 1 ? 's' : ''} uploaded
          </div>
          <button
            onClick={repairAllDocuments}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
            title="Fix document access issues by repairing document paths and creating missing directories"
          >
            Fix Access Issues
          </button>
        </div>
      </div>
      
      {!hasDocuments ? (
        <div className="text-center py-8 text-gray-500">
          No documents uploaded for this client
        </div>
      ) : (
        <div className="space-y-3">
          {documentCategories.map((category) => {
            const uploadedDocsCount = category.documents.filter(doc => doc.url !== null).length;
            const isActive = activeCategory === category.name;
            
            if (uploadedDocsCount === 0) return null;
            
            return (
              <div key={category.name} className="border border-gray-200 rounded-md overflow-hidden">
                <div 
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                >
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <FolderOpen className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Folder className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {uploadedDocsCount}
                    </span>
                  </div>
                </div>
                
                {isActive && (
                  <div className="bg-white">
                    <ul className="divide-y divide-gray-100">
                      {category.documents.map((doc) => {
                        if (!doc.url) return null;
                        
                        return (
                          <li key={doc.fieldName} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getDocumentIcon(doc.url)}
                                <span>{doc.label}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => viewDocument(doc)}
                                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="View document"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => advancedDownload(doc)}
                                  className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="Download document"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {/* Debugging info - display document path and add option to try different access methods */}
                            <div className="text-xs text-gray-400 truncate mt-1" title={doc.url || ''}>
                              <div className="flex space-x-1">
                                <span className="inline-block">
                                  Path: {doc.url ? doc.url.substring(0, 40) + (doc.url.length > 40 ? '...' : '') : 'No URL'}
                                </span>
                                <button 
                                  onClick={() => openDocumentInNewWindow(doc)} 
                                  className="ml-1 underline hover:text-blue-500"
                                  title="Open direct URL in new window"
                                >
                                  (direct)
                                </button>
                                <button 
                                  onClick={() => {
                                    if (doc.url) {
                                      const parsed = parseDocumentUrl(doc.url);
                                      if (parsed) {
                                        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
                                        const apiUrl = `${baseUrl}/api/clients/${parsed.clientId}/documents/${parsed.filename}`;
                                        window.open(apiUrl, '_blank');
                                      }
                                    }
                                  }} 
                                  className="underline hover:text-green-500"
                                  title="Open through API in new window"
                                >
                                  (api)
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-8">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">{previewDoc.label}</h3>
              <button onClick={closePreview} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div className="p-4 flex justify-center items-center h-[80vh]">
              {previewDoc.url && (
                previewDoc.url.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={getDocumentDirectUrl(previewDoc.url!)}
                    className="w-full h-full"
                    title={previewDoc.label}
                    onError={(e) => {
                      console.error('Error loading PDF document:', e);
                      toast.error('Failed to load document');
                    }}
                  />
                ) : (
                  <img 
                    src={getDocumentDirectUrl(previewDoc.url!)}
                    alt={previewDoc.label}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Log detailed information about the failed image
                      const imgElement = e.currentTarget;
                      console.error('Error loading image document:', {
                        src: imgElement.src,
                        alt: imgElement.alt,
                        naturalWidth: imgElement.naturalWidth,
                        naturalHeight: imgElement.naturalHeight,
                        errorEvent: e
                      });
                      // Also log the original document URL and parsed URL
                      console.error('Original URL:', previewDoc.url);
                      
                      // Try to detect CORS issues
                      if (imgElement.src.includes('localhost') && window.location.hostname !== 'localhost') {
                        console.error('Possible CORS issue: accessing localhost from remote host');
                        toast.error('Failed to load document: CORS issue detected');
                      } else {
                        toast.error('Failed to load document');
                      }
                      
                      // Set a fallback error message instead of an image
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'text-red-500 text-center p-4';
                        errorMsg.innerHTML = `
                          <div class="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <p class="text-lg font-semibold">Document could not be loaded</p>
                          <p class="text-sm mt-1">The file may be missing or inaccessible</p>
                          <p class="text-xs mt-2 text-gray-500">${imgElement.src}</p>
                          <div class="mt-4 flex justify-center space-x-2">
                            <button id="try-direct-url" class="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                              Try Direct URL
                            </button>
                            <button id="try-api-url" class="px-2 py-1 bg-green-500 text-white text-xs rounded">
                              Try API Access
                            </button>
                          </div>
                        `;
                        parent.appendChild(errorMsg);
                        
                        // Add event listeners to the buttons
                        setTimeout(() => {
                          const directBtn = document.getElementById('try-direct-url');
                          const apiBtn = document.getElementById('try-api-url');
                          
                          if (directBtn) {
                            directBtn.addEventListener('click', () => {
                              if (previewDoc.url) {
                                window.open(getDocumentDirectUrl(previewDoc.url), '_blank');
                              }
                            });
                          }
                          
                          if (apiBtn) {
                            apiBtn.addEventListener('click', () => {
                              if (previewDoc.url) {
                                const parsed = parseDocumentUrl(previewDoc.url);
                                if (parsed) {
                                  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
                                  const apiUrl = `${baseUrl}/api/clients/${parsed.clientId}/documents/${parsed.filename}`;
                                  window.open(apiUrl, '_blank');
                                }
                              }
                            });
                          }
                        }, 100);
                      }
                    }}
                  />
                )
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => advancedDownload(previewDoc)}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
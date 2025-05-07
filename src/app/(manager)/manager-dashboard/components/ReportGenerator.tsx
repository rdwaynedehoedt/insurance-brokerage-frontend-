'use client';

import { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { clientService, Client } from '@/lib/services/clients';
import { toast } from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Add the missing types for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

type ReportType = 'all_clients' | 'financial_summary' | 'policy_expiry';
type DateRange = 'all_time' | 'this_month' | 'this_quarter' | 'this_year' | 'custom';

export default function ReportGenerator({ isOpen, onClose, clients }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('all_clients');
  const [dateRange, setDateRange] = useState<DateRange>('all_time');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const getFilteredClients = (): Client[] => {
    // First filter by date range
    let filteredClients = [...clients];
    const today = new Date();
    let rangeStartDate: Date | null = null;
    let rangeEndDate: Date | null = null;

    switch (dateRange) {
      case 'this_month':
        rangeStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        rangeEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        rangeStartDate = new Date(today.getFullYear(), quarter * 3, 1);
        rangeEndDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'this_year':
        rangeStartDate = new Date(today.getFullYear(), 0, 1);
        rangeEndDate = new Date(today.getFullYear(), 11, 31);
        break;
      case 'custom':
        if (startDate) rangeStartDate = new Date(startDate);
        if (endDate) rangeEndDate = new Date(endDate);
        break;
      default:
        // all_time - no date filtering
        break;
    }

    if (rangeStartDate || rangeEndDate) {
      filteredClients = filteredClients.filter(client => {
        // Use policy dates for filtering
        const policyFromDate = client.policy_period_from ? new Date(client.policy_period_from) : null;
        
        if (!policyFromDate) return true; // Include clients without policy dates
        
        if (rangeStartDate && policyFromDate < rangeStartDate) return false;
        if (rangeEndDate && policyFromDate > rangeEndDate) return false;
        
        return true;
      });
    }

    return filteredClients;
  };

  const generatePDF = () => {
    setIsGenerating(true);
    const filteredClients = getFilteredClients();
    
    try {
      const doc = new jsPDF();
      let pageHeight = doc.internal.pageSize.height;
      
      // Add title and date
      const dateStr = new Date().toLocaleDateString();
      const timeStr = new Date().toLocaleTimeString();
      doc.setFontSize(18);
      doc.text('Insurance Brokerage Report', 14, 20);
      
      // Add report type
      let reportTitle = '';
      switch(reportType) {
        case 'all_clients':
          reportTitle = 'All Clients Report';
          break;
        case 'financial_summary':
          reportTitle = 'Financial Summary Report';
          break;
        case 'policy_expiry':
          reportTitle = 'Policy Expiry Report';
          break;
      }
      
      doc.setFontSize(14);
      doc.text(reportTitle, 14, 30);
      
      // Add date range info
      let dateRangeText = '';
      switch(dateRange) {
        case 'all_time':
          dateRangeText = 'All Time';
          break;
        case 'this_month':
          dateRangeText = 'This Month';
          break;
        case 'this_quarter':
          dateRangeText = 'This Quarter';
          break;
        case 'this_year':
          dateRangeText = 'This Year';
          break;
        case 'custom':
          dateRangeText = `From ${startDate} to ${endDate}`;
          break;
      }
      
      doc.setFontSize(12);
      doc.text(`Date Range: ${dateRangeText}`, 14, 40);
      doc.text(`Generated on: ${dateStr} at ${timeStr}`, 14, 48);
      
      doc.setFontSize(10);
      doc.text(`Total Clients: ${filteredClients.length}`, 14, 56);
      
      // Create table based on report type
      let headers: string[] = [];
      let data: any[][] = [];
      
      switch(reportType) {
        case 'all_clients':
          headers = ['Client Name', 'Contact', 'Product', 'Policy #', 'Insurance Provider'];
          data = filteredClients.map(client => [
            client.client_name,
            client.mobile_no,
            client.product,
            client.policy_no || '-',
            client.insurance_provider
          ]);
          break;
          
        case 'financial_summary':
          headers = ['Client Name', 'Sum Insured', 'Net Premium', 'Total Invoice', 'Commission'];
          data = filteredClients.map(client => [
            client.client_name,
            client.sum_insured?.toLocaleString() || '0',
            client.net_premium?.toLocaleString() || '0',
            client.total_invoice?.toLocaleString() || '0',
            ((client.commission_basic || 0) + (client.commission_srcc || 0) + (client.commission_tc || 0)).toLocaleString()
          ]);
          
          // Add totals row
          const totalSumInsured = filteredClients.reduce((sum, client) => sum + (client.sum_insured || 0), 0);
          const totalNetPremium = filteredClients.reduce((sum, client) => sum + (client.net_premium || 0), 0);
          const totalInvoice = filteredClients.reduce((sum, client) => sum + (client.total_invoice || 0), 0);
          const totalCommission = filteredClients.reduce((sum, client) => 
            sum + (client.commission_basic || 0) + (client.commission_srcc || 0) + (client.commission_tc || 0), 0);
          
          data.push([
            'TOTAL',
            totalSumInsured.toLocaleString(),
            totalNetPremium.toLocaleString(),
            totalInvoice.toLocaleString(),
            totalCommission.toLocaleString()
          ]);
          break;
          
        case 'policy_expiry':
          headers = ['Client Name', 'Policy #', 'Start Date', 'End Date', 'Days Left'];
          data = filteredClients
            .filter(client => client.policy_period_to) // Only include clients with expiry dates
            .map(client => {
              const endDate = new Date(client.policy_period_to || '');
              const today = new Date();
              const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return [
                client.client_name,
                client.policy_no || '-',
                client.policy_period_from ? new Date(client.policy_period_from).toLocaleDateString() : '-',
                client.policy_period_to ? new Date(client.policy_period_to).toLocaleDateString() : '-',
                daysLeft.toString()
              ];
            })
            .sort((a, b) => parseInt(a[4]) - parseInt(b[4])); // Sort by days left
          break;
      }
      
      // Add the table using the autoTable function
      autoTable(doc, {
        startY: 65,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [255, 102, 0], textColor: [255, 255, 255] },
        footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
        margin: { top: 65 }
      });
      
      // Save the PDF
      const fileName = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Generate Report</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  reportType === 'all_clients' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReportType('all_clients')}
              >
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium">All Clients</span>
                </div>
                <p className="text-xs text-gray-500">
                  Basic information about all clients including contact details and policy numbers.
                </p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  reportType === 'financial_summary' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReportType('financial_summary')}
              >
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium">Financial Summary</span>
                </div>
                <p className="text-xs text-gray-500">
                  Summary of financial data including premiums, commissions and total invoices.
                </p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  reportType === 'policy_expiry' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setReportType('policy_expiry')}
              >
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium">Policy Expiry</span>
                </div>
                <p className="text-xs text-gray-500">
                  List of policies with their expiration dates and days remaining.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Date Range</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button
                className={`px-3 py-2 text-sm rounded-md ${
                  dateRange === 'all_time' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('all_time')}
              >
                All Time
              </button>
              
              <button
                className={`px-3 py-2 text-sm rounded-md ${
                  dateRange === 'this_month' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('this_month')}
              >
                This Month
              </button>
              
              <button
                className={`px-3 py-2 text-sm rounded-md ${
                  dateRange === 'this_quarter' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('this_quarter')}
              >
                This Quarter
              </button>
              
              <button
                className={`px-3 py-2 text-sm rounded-md ${
                  dateRange === 'this_year' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('this_year')}
              >
                This Year
              </button>
              
              <button
                className={`px-3 py-2 text-sm rounded-md ${
                  dateRange === 'custom' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setDateRange('custom')}
              >
                Custom Range
              </button>
            </div>
            
            {dateRange === 'custom' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={generatePDF}
              disabled={isGenerating || (dateRange === 'custom' && (!startDate || !endDate))}
              className={`flex items-center px-4 py-2 rounded-md text-white ${
                isGenerating || (dateRange === 'custom' && (!startDate || !endDate))
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate & Download Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
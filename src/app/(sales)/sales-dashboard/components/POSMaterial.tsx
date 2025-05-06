import { Download } from 'lucide-react';

export default function POSMaterial() {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">POS Material</h2>
      <ul className="space-y-3">
        <li className="flex items-center justify-between">
          <span className="text-gray-700">Product Brochure.pdf</span>
          <button className="flex items-center px-3 py-1 text-orange-700 border border-orange-100 rounded-lg hover:bg-orange-50">
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-gray-700">Sales Guide.docx</span>
          <button className="flex items-center px-3 py-1 text-orange-700 border border-orange-100 rounded-lg hover:bg-orange-50">
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-gray-700">Claim Form.pdf</span>
          <button className="flex items-center px-3 py-1 text-orange-700 border border-orange-100 rounded-lg hover:bg-orange-50">
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </li>
      </ul>
    </section>
  );
} 
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle, FileText, CheckCircle, Wrench } from 'lucide-react';

// Replace the missing config import with a hardcoded API URL
const API_BASE_URL = 'http://localhost:5000';

interface DirectDocumentViewerProps {
  documentPath: string;
  title: string;
  showDiagnostics?: boolean;
}

const DirectDocumentViewer: React.FC<DirectDocumentViewerProps> = ({ 
  documentPath, 
  title, 
  showDiagnostics = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [repairing, setRepairing] = useState(false);
  const [repairResult, setRepairResult] = useState<any>(null);

  const directPath = `${API_BASE_URL}${documentPath}`;
  
  useEffect(() => {
    if (!documentPath) {
      setLoading(false);
      setError('No document path provided');
      return;
    }
    
    // Reset state when document path changes
    setLoading(true);
    setError(null);
    setFileInfo(null);
    
    // Check if file exists using a HEAD request
    axios.head(directPath)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError(`Document could not be loaded: ${err.message}`);
        
        // If we have diagnostics enabled, also try to get file info
        if (showDiagnostics) {
          checkFileInfo();
        }
      });
  }, [documentPath, directPath, showDiagnostics]);
  
  const checkFileInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/test-file-access`, {
        params: { path: documentPath }
      });
      setFileInfo(response.data);
    } catch (err) {
      console.error('Error getting file info:', err);
    }
  };
  
  const repairAllDocuments = async () => {
    setRepairing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/repair-all-documents`);
      setRepairResult(response.data);
      // Reload the page to see the changes
      window.location.reload();
    } catch (err: any) {
      setRepairResult({
        success: false,
        error: err.message
      });
    } finally {
      setRepairing(false);
    }
  };

  if (!documentPath) {
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-gray-600">No document available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{title || 'Document'}</h3>
        {showDiagnostics && (
          <div className="flex gap-2">
            <button 
              onClick={checkFileInfo}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              Diagnose
            </button>
            <button 
              onClick={repairAllDocuments}
              className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center gap-1"
              disabled={repairing}
            >
              {repairing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Repairing...</span>
                </>
              ) : (
                <>
                  <Wrench className="h-3 w-3" />
                  <span>Repair All</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
            <p className="text-gray-600">Loading document...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">Path: {documentPath}</p>
              </div>
            </div>
            
            {showDiagnostics && (
              <div className="flex gap-2">
                <a 
                  href={directPath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>Direct Link</span>
                </a>
              </div>
            )}
            
            {fileInfo && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">File Diagnostics:</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(fileInfo, null, 2)}
                </pre>
              </div>
            )}

            {repairResult && (
              <div className={`mt-4 p-4 rounded-md ${repairResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start">
                  {repairResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {repairResult.success ? "Repair Successful" : "Repair Failed"}
                    </h4>
                    {repairResult.success ? (
                      <div className="mt-2 text-sm">
                        <p>Fixed {repairResult.fixedPaths} document paths</p>
                        <p>Created {repairResult.createdDirectories} directories</p>
                        <p>Processed {repairResult.clientsProcessed} clients</p>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">{repairResult.error || "Unknown error occurred"}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {documentPath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img 
                src={directPath} 
                alt={title || "Document"} 
                className="max-w-full max-h-80 object-contain" 
              />
            ) : documentPath.match(/\.pdf$/i) ? (
              <iframe 
                src={directPath}
                title={title || "PDF Document"}
                className="w-full h-96 border-0"
              />
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-3">Document available for download</p>
                <a 
                  href={directPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Open Document</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectDocumentViewer; 
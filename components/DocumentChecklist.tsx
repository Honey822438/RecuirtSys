
import React from 'react';
// FIX: 'DocumentStatus' is an enum, which is a runtime value. It needs to be imported without the 'type' keyword. 'Document' remains a type-only import.
import { type Document, DocumentStatus } from '../types';
import StatusBadge from './StatusBadge';

interface DocumentChecklistProps {
  documents: Document[];
  onDocumentUpdate?: (docId: string, newStatus: DocumentStatus) => void;
}

const documentStatusOptions = Object.values(DocumentStatus);

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ documents, onDocumentUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Document Checklist</h3>
      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
                 <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                 {doc.url && (
                     <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline hover:text-blue-800 font-medium"
                     >
                         (View)
                     </a>
                 )}
            </div>
            <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                {onDocumentUpdate && (
                  <select 
                    value={doc.status}
                    onChange={(e) => onDocumentUpdate(doc.id, e.target.value as DocumentStatus)}
                    className="block w-28 text-xs py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {documentStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentChecklist;

import React, { useState } from 'react';
// FIX: Import CollectionMethod enum to use its members instead of string literals.
import { type Candidate, DocumentStatus, type Employee, MedicalStatus, WorkflowStatus, type Guardian, type Payment, CollectionMethod } from '../types';
import DocumentChecklist from './DocumentChecklist';
import PaymentInfo from './PaymentInfo';
import StatusBadge from './StatusBadge';
import { MOCK_EMPLOYEES } from '../constants';

// Hiring Portal Components
import EditPaymentModal from './hiring/EditPaymentModal';
import EditGuardianModal from './hiring/EditGuardianModal';
import VideosSection from './hiring/VideosSection';

interface CandidateDetailProps {
  candidate: Candidate;
  onUpdateCandidate?: (updatedCandidate: Candidate) => void;
  allEmployees?: Employee[];
}

const InfoField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <div className="text-sm font-medium text-gray-800">{value}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; onEdit?: () => void }> = ({ title, children, onEdit }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {onEdit && (
                <button onClick={onEdit} className="text-sm font-medium text-accent-600 hover:text-accent-800">Edit</button>
            )}
        </div>
        {children}
    </div>
);

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onUpdateCandidate, allEmployees = MOCK_EMPLOYEES }) => {
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const wakalaInputRef = React.useRef<HTMLInputElement>(null);
  const briefingInputRef = React.useRef<HTMLInputElement>(null);
  const affidavitInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleDocumentUpdate = (docId: string, newStatus: DocumentStatus) => {
    if (!onUpdateCandidate) return;
    const updatedDocuments = candidate.documents.map(doc => 
        doc.id === docId ? { ...doc, status: newStatus } : doc
    );
    onUpdateCandidate({ ...candidate, documents: updatedDocuments });
  };
  
  const handleGenericDocUpload = (event: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    if (event.target.files && event.target.files[0] && onUpdateCandidate) {
        const existingDoc = candidate.documents.find(d => d.name === docName);
        let updatedDocuments: Candidate['documents'];
        if(existingDoc) {
            updatedDocuments = candidate.documents.map(d => d.name === docName ? {...d, status: DocumentStatus.Received } : d);
        } else {
            // FIX: Use the CollectionMethod enum member instead of a string literal to conform to the Document type.
            updatedDocuments = [...candidate.documents, { id: `doc_${Date.now()}`, name: docName, status: DocumentStatus.Received, collectionMethod: CollectionMethod.Direct }];
        }
        onUpdateCandidate({ ...candidate, documents: updatedDocuments });
        alert(`${docName} document uploaded successfully!`);
    }
    event.target.value = ''; // Reset file input
  };

  const handleSendReminder = () => {
      alert(`Reminder sent to ${candidate.name}`);
  };

  const handleTicketUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0] && onUpdateCandidate) {
          const file = event.target.files[0];
          const ticket = {
              url: `/${file.name}`,
              travelDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          };
          onUpdateCandidate({ ...candidate, flightTicket: ticket, progress: Math.max(candidate.progress, 98) });
          alert('Flight ticket uploaded successfully!');
      }
  };

  const handleOfficerReassign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateCandidate) {
      onUpdateCandidate({ ...candidate, hiringOfficerId: e.target.value });
    }
  };
  
  const handleMedicalStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateCandidate) {
      onUpdateCandidate({ ...candidate, medicalStatus: e.target.value as MedicalStatus });
    }
  };

  const handleUpdateVideos = (videos: string[]) => {
    if (onUpdateCandidate) {
      onUpdateCandidate({ ...candidate, videos });
    }
  };

  const hiringOfficers = allEmployees.filter(e => e.role === 'hiring');
  const currentOfficer = hiringOfficers.find(h => h.id === candidate.hiringOfficerId)?.name || 'N/A';
  
  const isPostVisa = [
      WorkflowStatus.VisaIssued,
      WorkflowStatus.AwaitingBureau,
      WorkflowStatus.NOCReceived,
      WorkflowStatus.AwaitingProtector,
      WorkflowStatus.ProtectorDone
  ].includes(candidate.workflowStatus);

  return (
    <div className="space-y-6 pb-6 h-full overflow-y-auto pr-2">
      {isEditPaymentOpen && onUpdateCandidate && (
        <EditPaymentModal 
          candidate={candidate}
          onClose={() => setIsEditPaymentOpen(false)}
          onSave={(payment: Payment) => {
            onUpdateCandidate({ ...candidate, payment });
            setIsEditPaymentOpen(false);
          }}
        />
      )}
      {isEditGuardianOpen && onUpdateCandidate && (
        <EditGuardianModal 
          candidate={candidate}
          onClose={() => setIsEditGuardianOpen(false)}
          onSave={(guardian, bankAccount) => {
            onUpdateCandidate({ ...candidate, guardian, bankAccount });
            setIsEditGuardianOpen(false);
          }}
        />
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-200"
            src={candidate.avatarUrl}
            alt={candidate.name}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-primary-900">{candidate.name}</h2>
            <p className="text-primary-600">{candidate.email}</p>
            <div className="mt-2 flex items-center gap-x-4 gap-y-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Workflow Status:</span>
                    <StatusBadge status={candidate.workflowStatus} />
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="medicalStatus" className="text-sm font-medium text-gray-600">Medical Status:</label>
                    {onUpdateCandidate ? (
                        <select 
                            id="medicalStatus"
                            value={candidate.medicalStatus}
                            onChange={handleMedicalStatusChange}
                            className="text-xs border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                            {Object.values(MedicalStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    ) : (
                        <StatusBadge status={candidate.medicalStatus} />
                    )}
                </div>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <button 
                onClick={() => alert("Generating PDF with all candidate documents...")}
                disabled={!isPostVisa}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate PDF
            </button>
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-1">Overall Progress</label>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-accent-400 to-accent-500 h-4 rounded-full"
              style={{ width: `${candidate.progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm font-semibold text-primary-700 mt-1">{candidate.progress}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Payment Details" onEdit={onUpdateCandidate ? () => setIsEditPaymentOpen(true) : undefined}>
            <PaymentInfo payment={candidate.payment} />
        </Section>
        
        <Section title="Guardian & Bank Details" onEdit={onUpdateCandidate ? () => setIsEditGuardianOpen(true) : undefined}>
            <div className="space-y-4">
                <InfoField label="Guardian" value={`${candidate.guardian.relation} - ${candidate.guardian.cnic}`} />
                <InfoField label="Guardian Contact" value={candidate.guardian.contactNumber} />
                <InfoField label="Bank Account" value={candidate.bankAccount} />
            </div>
        </Section>
      </div>

       <Section title="Assignment">
         <InfoField 
            label="Assigned Hiring Officer" 
            value={onUpdateCandidate && allEmployees ? (
                <select 
                    value={candidate.hiringOfficerId}
                    onChange={handleOfficerReassign}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                    {hiringOfficers.map(officer => (
                        <option key={officer.id} value={officer.id}>{officer.name}</option>
                    ))}
                </select>
            ) : currentOfficer }
         />
       </Section>

      {onUpdateCandidate && (
        <VideosSection 
            videos={candidate.videos}
            onUpdateVideos={handleUpdateVideos}
        />
      )}

      <DocumentChecklist 
        documents={candidate.documents} 
        onDocumentUpdate={onUpdateCandidate ? handleDocumentUpdate : undefined}
      />

      <Section title="Actions">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input type="file" ref={fileInputRef} onChange={handleTicketUpload} className="hidden" accept="image/png, image/jpeg, .pdf" />
            <input type="file" ref={wakalaInputRef} onChange={(e) => handleGenericDocUpload(e, 'Wakala')} className="hidden" accept="image/png, image/jpeg, .pdf" />
            <input type="file" ref={briefingInputRef} onChange={(e) => handleGenericDocUpload(e, 'Briefing Paper')} className="hidden" accept="image/png, image/jpeg, .pdf" />
            <input type="file" ref={affidavitInputRef} onChange={(e) => handleGenericDocUpload(e, 'Affidavit')} className="hidden" accept="image/png, image/jpeg, .pdf" />
            
            <button onClick={() => handleUploadClick(fileInputRef)} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Upload Flight Ticket</button>
            <button onClick={() => handleUploadClick(wakalaInputRef)} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Upload Wakala</button>
            <button 
                onClick={() => handleUploadClick(briefingInputRef)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
            >
                Upload Briefing Paper
            </button>
            <button 
                onClick={() => handleUploadClick(affidavitInputRef)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
            >
                Upload Affidavit
            </button>
            <button onClick={handleSendReminder} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">Send Reminder</button>
        </div>
        {candidate.flightTicket && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Flight ticket uploaded for: <span className="font-bold">{new Date(candidate.flightTicket.travelDate).toLocaleDateString()}</span>. <a href={candidate.flightTicket.url} target="_blank" rel="noopener noreferrer" className="underline">View Ticket</a></p>
            </div>
        )}
      </Section>
    </div>
  );
};

export default CandidateDetail;
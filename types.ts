
import type { Role } from './App';

export enum DocumentStatus {
  Pending = 'Pending',
  Received = 'Received',
  Sent = 'Sent',
  Attested = 'Attested',
  OnHand = 'On Hand',
}

export enum MedicalStatus {
  Fit = 'Fit',
  Unfit = 'Unfit',
  SlipSent = 'Slip Sent',
  NoSlip = 'No Slip',
}

export enum WorkflowStatus {
  Entry = 'Entry',
  AwaitingDataflow = 'Awaiting Dataflow',
  DataflowApplied = 'Dataflow Applied',
  DataflowCompleted = 'Dataflow Completed',
  AwaitingMumaris = 'Awaiting Mumaris',
  MumarisApplied = 'Mumaris Applied',
  AwaitingQVP = 'Awaiting QVP',
  QVPApplied = 'QVP Applied',
  AwaitingEmbassy = 'Awaiting Embassy',
  VisaIssued = 'Visa Issued',
  AwaitingBureau = 'Awaiting Bureau',
  NOCReceived = 'NOC Received',
  AwaitingProtector = 'Awaiting Protector',
  ProtectorDone = 'Protector Done',
}

export enum CustomerType {
  Fresh = 'Fresh',
  Return = 'Return',
  InProcess = 'In-process',
}

export enum CollectionMethod {
    NotCollected = 'Not Collected',
    Courier = 'Courier',
    WhatsApp = 'WhatsApp',
    Direct = 'Direct',
}

export enum DiplomaVerificationStatus {
    None = 'None',
    SentToBoard = 'Sent to Board',
    ReceivedFromBoard = 'Received from Board',
    SentToMOFA = 'Sent to MOFA',
    ReceivedFromMOFA = 'Received from MOFA',
    SentToEmbassy = 'Sent to Embassy',
    ReceivedFromEmbassy = 'Received from Embassy (Attested)',
}


export interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  collectionMethod: CollectionMethod;
  verificationStatus?: DiplomaVerificationStatus;
  url?: string;
}

export interface Payment {
  agreed: number;
  additional: number;
  received: number;
}

export interface Guardian {
  relation: 'Father' | 'Mother' | 'Husband' | 'Brother';
  cnic: string;
  contactNumber: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  progress: number;
  payment: Payment;
  flightTicket?: {
    url: string;
    travelDate: string;
  };
  documents: Document[];
  medicalStatus: MedicalStatus;
  guardian: Guardian;
  bankAccount: string;
  videos: string[];
  workflowStatus: WorkflowStatus;
  hiringOfficerId: string;
  customerType: CustomerType;
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  email: string;
  password: string;
}

export interface DemandLetter {
  id: string;
  clinicName: string;
  positions: number;
  status: 'Active' | 'Fulfilled';
}

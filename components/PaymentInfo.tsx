
import React from 'react';
import type { Payment } from '../types';

interface PaymentInfoProps {
  payment: Payment;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ payment }) => {
  const balance = payment.agreed + payment.additional - payment.received;
  const progress = (payment.received / (payment.agreed + payment.additional)) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Payment Details</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Agreed Amount:</span>
          <span className="text-sm font-semibold text-gray-800">${payment.agreed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Additional Payments:</span>
          <span className="text-sm font-semibold text-gray-800">${payment.additional.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Received:</span>
          <span className="text-sm font-bold text-green-600">${payment.received.toLocaleString()}</span>
        </div>
        <hr/>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Balance Due:</span>
          <span className={`text-sm font-bold ${balance > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            ${balance.toLocaleString()}
          </span>
        </div>
         <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">
            {Math.round(progress)}% of total paid
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;

import React from 'react';

export type StatusBadgeFamily =
  | 'invoice'
  | 'bill'
  | 'expense'
  | 'invitation'
  | 'coa';

interface StatusBadgeProps {
  status: string;
  family?: StatusBadgeFamily;
}

type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const TONE_CLASS: Record<BadgeTone, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  neutral: 'badge-neutral',
};

function toneFor(status: string, family?: StatusBadgeFamily): BadgeTone {
  const s = status.trim().toLowerCase();
  switch (family) {
    case 'invoice':
      if (s === 'paid') return 'success';
      if (s === 'overdue') return 'error';
      if (s === 'draft') return 'neutral';
      return 'warning';
    case 'bill':
      if (s === 'paid') return 'success';
      if (s === 'overdue' || s === 'void') return 'error';
      if (s === 'draft') return 'neutral';
      return 'warning';
    case 'expense':
      if (s === 'paid') return 'success';
      if (s === 'reimbursed') return 'info';
      return 'warning';
    case 'invitation':
      if (s === 'accepted') return 'success';
      if (s === 'pending') return 'warning';
      if (s === 'cancelled') return 'error';
      return 'warning';
    case 'coa':
      return s === 'active' ? 'success' : 'warning';
    default:
      if (s === 'paid' || s === 'accepted' || s === 'active') return 'success';
      if (s === 'overdue' || s === 'void' || s === 'cancelled') return 'error';
      if (s === 'reimbursed') return 'info';
      return 'warning';
  }
}

function labelFor(status: string, family?: StatusBadgeFamily): string {
  const s = status.trim().toLowerCase();
  if (family === 'invoice' && s === 'sent') return 'Pending';
  if (family === 'expense' && (s === 'unpaid' || s === 'pending')) {
    return 'Pending';
  }
  const spaced = status.replace(/_/g, ' ').trim();
  if (!spaced) return status;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, family }) => {
  const tone = toneFor(status, family);
  return (
    <span className={`badge ${TONE_CLASS[tone]}`}>
      {labelFor(status, family)}
    </span>
  );
};

export default StatusBadge;

import React, { useState } from 'react';

interface TooltipButtonProps {
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** 'top' = above button (default), 'bottom' = below button */
  placement?: 'top' | 'bottom';
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  title,
  ariaLabel,
  children,
  className = '',
  onClick,
  placement = 'top',
}) => {
  const [show, setShow] = useState(false);
  const tooltipClass =
    placement === 'bottom'
      ? 'absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded shadow-lg whitespace-nowrap z-50 pointer-events-none'
      : 'absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded shadow-lg whitespace-nowrap z-50 pointer-events-none';

  return (
    <span className='relative inline-block'>
      <button
        type='button'
        className={className}
        aria-label={ariaLabel}
        title={title}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={onClick}
      >
        {children}
      </button>
      {show && (
        <span className={tooltipClass} role='tooltip'>
          {title}
        </span>
      )}
    </span>
  );
};

export default TooltipButton;

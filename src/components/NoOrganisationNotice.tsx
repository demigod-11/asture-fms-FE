import React from 'react';

interface NoOrganisationNoticeProps {
  children: React.ReactNode;
}

const NoOrganisationNotice: React.FC<NoOrganisationNoticeProps> = ({
  children,
}) => <div className='p-4 text-gray-600 dark:text-gray-400'>{children}</div>;

export default NoOrganisationNotice;

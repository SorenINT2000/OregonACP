import React from 'react';
import { CommitteeDashboard } from '../../components/CommitteeDashboard';

export const PolicyCommittee: React.FC = () => {
  return (
    <CommitteeDashboard
      title="Policy Committee Dashboard"
      collectionName="policyBlog"
    />
  );
}; 
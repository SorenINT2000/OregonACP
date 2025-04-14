import React from 'react';
import { CommitteeDashboard } from '../../components/CommitteeDashboard';

export const ChapterMeetingCommittee: React.FC = () => {
  return (
    <CommitteeDashboard
      title="Chapter Meeting Committee Dashboard"
      collectionName="chapterMeetingBlog"
    />
  );
}; 
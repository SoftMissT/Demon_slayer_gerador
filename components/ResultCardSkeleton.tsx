import React from 'react';
import { Card } from './ui/Card';

export const ResultCardSkeleton: React.FC = () => {
  return (
    <Card className="!p-0 flex flex-col h-full overflow-hidden">
      <div className="animate-pulse flex flex-col h-full">
        <div className="aspect-video bg-gray-700 w-full"></div>
        <div className="p-3 flex flex-col flex-grow justify-between">
            <div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-1.5"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-end mt-3">
                <div className="h-5 bg-gray-700 rounded w-1/4"></div>
                <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
            </div>
        </div>
      </div>
    </Card>
  );
};
import React from 'react';
import { Card } from './ui/Card';

export const ResultCardSkeleton: React.FC = () => {
  return (
    <Card className="!p-3">
      <div className="animate-pulse flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex-grow pr-16 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-1 mt-2">
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="mt-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    </Card>
  );
};

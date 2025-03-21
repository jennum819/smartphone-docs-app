import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  // 進捗状況が0-100の範囲内に収まるようにする
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="w-full my-4">
      {label && (
        <div className="mb-1 text-sm font-medium text-gray-700">{label}: {normalizedProgress}%</div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

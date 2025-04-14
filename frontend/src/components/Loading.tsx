import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spin size="large" />
    </div>
  );
};

export default Loading; 
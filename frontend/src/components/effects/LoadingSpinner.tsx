import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        {/* Vòng tròn đỏ */}
        <div className="absolute inset-0 border-8 border-red-500 rounded-full animate-spin" />
        
        {/* Các chấm xoay */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-30px)`,
                animation: `dot-fade 1s ease-in-out ${i * 0.125}s infinite`
              }}
            />
          ))}
        </div>

        {/* Hình tròn ở giữa */}
        <div className="absolute inset-0 m-auto w-4 h-4 bg-red-500 rounded-full" />
      </div>

      <style>
        {`
          @keyframes dot-fade {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 
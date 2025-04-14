import React, { useEffect } from 'react';

const SakuraEffect = () => {
  useEffect(() => {
    const createSakura = () => {
      const sakura = document.createElement('div');
      const size = Math.random() * 15 + 10; // 10-25px
      
      sakura.className = `
        absolute w-[${size}px] h-[${size}px] 
        bg-pink-200/80 rounded-full 
        before:content-[''] before:absolute before:w-full before:h-full 
        before:bg-pink-100/80 before:rounded-full before:transform before:rotate-45
      `;
      
      // Random starting position
      sakura.style.left = Math.random() * window.innerWidth + 'px';
      sakura.style.top = '-20px';
      
      // Random animation duration and delay
      const duration = Math.random() * 3 + 4; // 4-7s
      const delay = Math.random() * 5; // 0-5s
      
      sakura.style.animation = `
        fall ${duration}s linear ${delay}s infinite,
        sway ${duration / 2}s ease-in-out ${delay}s infinite alternate
      `;
      
      document.getElementById('sakura-container')?.appendChild(sakura);
      
      // Remove petal after animation
      setTimeout(() => {
        sakura.remove();
      }, (duration + delay) * 1000);
    };

    // Create petals periodically
    const interval = setInterval(createSakura, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="sakura-container" className="fixed inset-0 pointer-events-none z-0">
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes sway {
            0% {
              transform: translateX(0px);
            }
            100% {
              transform: translateX(50px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SakuraEffect; 
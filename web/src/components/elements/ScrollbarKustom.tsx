import React from 'react';

const ScrollbarKustom = () => {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      .custom-scrollbar::-webkit-scrollbar {
        width: 12px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 10px;
        border: 3px solid white;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #94a3b8;
      }
      .custom-scrollbar::-webkit-scrollbar-button:single-button {
        display: block;
        background-color: transparent;
        height: 16px;
        background-size: 12px;
        background-repeat: no-repeat;
      }
      .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement {
        background-position: center 5px;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'><polyline points='18 15 12 9 6 15'></polyline></svg>");
      }
      .custom-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment {
        background-position: center 3px;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
      }
    `}} />
  );
};

export default ScrollbarKustom;

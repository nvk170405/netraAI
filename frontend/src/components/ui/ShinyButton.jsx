import React from 'react';
import './ShinyButton.css';

export function ShinyButton({ children, onClick, className = '' }) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

export default ShinyButton;

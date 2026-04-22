'use client';

import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, ...props }) => {
  return (
    <div className="input-group">
      <label style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        fontWeight: 600,
        textAlign: 'left'
      }}>
        {label}
      </label>
      <input {...props} />
    </div>
  );
};

import React from 'react';
import { getInitials } from '../../utils/helpers';

const COLORS = ['#2d5a8e','#c84b31','#2d7a4f','#6b21a8','#92400e','#0369a1','#166534'];

const Avatar = ({ name = '', size = 36, className = '' }) => {
  const initials = getInitials(name);
  const colorIndex = name.charCodeAt(0) % COLORS.length;
  const bg = COLORS[colorIndex] || COLORS[0];

  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, color: '#fff',
        fontSize: size * 0.33, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;

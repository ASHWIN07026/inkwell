import React from 'react';
import { CATEGORY_COLORS } from '../../utils/helpers';

const CategoryBadge = ({ category }) => {
  const style = CATEGORY_COLORS[category] || { bg: '#e5e7eb', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      borderRadius: 3, fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.5px',
      background: style.bg, color: style.color,
    }}>
      {category}
    </span>
  );
};

export default CategoryBadge;

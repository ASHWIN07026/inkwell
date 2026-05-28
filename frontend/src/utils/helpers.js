import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

export const truncate = (str, len = 160) =>
  str?.length > len ? str.slice(0, len) + '...' : str;

export const CATEGORIES = ['Technology', 'Design', 'Science', 'Lifestyle', 'Culture', 'Business', 'Health'];

export const CATEGORY_COLORS = {
  Technology: { bg: '#dbeafe', color: '#1e40af' },
  Design: { bg: '#fce7f3', color: '#9d174d' },
  Science: { bg: '#fef3c7', color: '#92400e' },
  Lifestyle: { bg: '#dcfce7', color: '#15803d' },
  Culture: { bg: '#f3e8ff', color: '#6b21a8' },
  Business: { bg: '#e0f2fe', color: '#0369a1' },
  Health: { bg: '#f0fdf4', color: '#166534' },
};

export const parseMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/, '<p>')
    + '</p>';
};

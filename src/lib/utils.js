export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
  }
  
  export function formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
// utils.js
export const formatTime = (timeString) => {
  if (!timeString) return ""; // or "N/A" or "00:00"
  
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } catch (e) {
    console.warn("Invalid time format:", timeString);
    return ""; // or return the original string
  }
};
  
  export function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  export function getStatusColor(status) {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'declined':
        return 'status-declined';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
  
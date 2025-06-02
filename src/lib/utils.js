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
  
  export function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  }
  
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
  
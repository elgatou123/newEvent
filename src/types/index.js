// src/types/index.js

// Event Types (String Constants)
export const EventType = {
  WEDDING: 'wedding',
  PARTY: 'party',
  FUNERAL: 'funeral',
  BIRTHDAY: 'birthday',
  CONFERENCE: 'conference',
  MEETING: 'meeting',
  OTHER: 'other'
};

// Response Statuses
export const ResponseStatus = {
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  PENDING: 'pending'
};

// Service Object
export const Service = {
  id: '',
  name: '',
  description: ''
};

// Event Object
export const Event = {
  id: '',
  title: '',
  description: '',
  type: '', // one of the values from EventType
  location: '',
  date: '',
  time: '',
  image: '',
  organizerId: '',
  organizerName: '',
  services: [] // Array of Service objects
};

// Invitation Object
export const Invitation = {
  id: '',
  eventId: '',
  guestName: '',
  guestEmail: '',
  status: '', // one of the values from ResponseStatus
  inviteLink: ''
};

// Reservation Object
export const Reservation = {
  id: '',
  eventId: '',
  name: '',
  email: '',
  inviteLink: '',
  guests: [] // Array of Invitation objects
};

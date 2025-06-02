
export const mockEvents = [
  {
    id: "1",
    title: "Summer Wedding Celebration",
    description: "Join us for the wedding of John and Jane. A beautiful ceremony followed by dinner and dancing.",
    type: "wedding",
    location: "Grand Plaza Hotel, New York",
    date: "2025-06-15",
    time: "15:00",
    image: "/placeholder.svg",
    organizerId: "user1",
    organizerName: "John Smith",
    services: [
      { id: "s1", name: "Catering", description: "Full service dinner and cocktails" },
      { id: "s2", name: "Music", description: "Live band and DJ" },
      { id: "s3", name: "Photography", description: "Professional wedding photography" }
    ]
  },
  {
    id: "2",
    title: "Tech Conference 2025",
    description: "Annual technology conference featuring the latest innovations and industry leaders.",
    type: "conference",
    location: "Tech Center, San Francisco",
    date: "2025-09-20",
    time: "09:00",
    image: "/placeholder.svg",
    organizerId: "user2",
    organizerName: "TechCorp Inc.",
    services: [
      { id: "s4", name: "Catering", description: "Breakfast and lunch provided" },
      { id: "s5", name: "Workshops", description: "Hands-on technical workshops" },
      { id: "s6", name: "Networking", description: "Evening networking reception" }
    ]
  },
  {
    id: "3",
    title: "Birthday Bash - Alex's 30th",
    description: "Come celebrate Alex's 30th birthday with food, drinks, and dancing!",
    type: "birthday",
    location: "Skyline Lounge, Chicago",
    date: "2025-07-10",
    time: "20:00",
    image: "/placeholder.svg",
    organizerId: "user3",
    organizerName: "Alex Johnson",
    services: [
      { id: "s7", name: "Open Bar", description: "Premium drinks included" },
      { id: "s8", name: "DJ", description: "Professional DJ all night" },
      { id: "s9", name: "Food", description: "Buffet style dinner" }
    ]
  },
  {
    id: "4",
    title: "Annual Company Retreat",
    description: "Our annual company retreat with team building activities and strategic planning.",
    type: "meeting",
    location: "Mountain Resort, Colorado",
    date: "2025-10-05",
    time: "08:00",
    image: "/placeholder.svg",
    organizerId: "user4",
    organizerName: "Global Enterprises",
    services: [
      { id: "s10", name: "Accommodation", description: "3 nights stay included" },
      { id: "s11", name: "Activities", description: "Team building and outdoor activities" },
      { id: "s12", name: "Meals", description: "All meals included" }
    ]
  },
  {
    id: "5",
    title: "Charity Gala Dinner",
    description: "Annual fundraising gala for wildlife conservation with silent auction and entertainment.",
    type: "party",
    location: "Royal Garden Hall, Miami",
    date: "2025-11-15",
    time: "19:00",
    image: "/placeholder.svg",
    organizerId: "user5",
    organizerName: "Wildlife Foundation",
    services: [
      { id: "s13", name: "Gourmet Dinner", description: "5-course meal by top chef" },
      { id: "s14", name: "Entertainment", description: "Live music and performance" },
      { id: "s15", name: "Auction", description: "Silent and live auction" }
    ]
  }
];

export const mockInvitations = [
  {
    id: "inv1",
    eventId: "1",
    guestName: "Robert Brown",
    guestEmail: "robert@example.com",
    status: "confirmed",
    inviteLink: "invite-link-1"
  },
  {
    id: "inv2",
    eventId: "1",
    guestName: "Sarah White",
    guestEmail: "sarah@example.com",
    status: "pending",
    inviteLink: "invite-link-2"
  },
  {
    id: "inv3",
    eventId: "1",
    guestName: "Mike Johnson",
    guestEmail: "mike@example.com",
    status: "declined",
    inviteLink: "invite-link-3"
  },
  {
    id: "inv4",
    eventId: "2",
    guestName: "Linda Miller",
    guestEmail: "linda@example.com",
    status: "confirmed",
    inviteLink: "invite-link-4"
  },
  {
    id: "inv5",
    eventId: "3",
    guestName: "James Wilson",
    guestEmail: "james@example.com",
    status: "pending",
    inviteLink: "invite-link-5"
  }
];

export const mockReservations = [
  {
    id: "res1",
    eventId: "1",
    name: "Alice Thompson",
    email: "alice@example.com",
    inviteLink: "wedding-2025-alice",
    guests: mockInvitations.filter(inv => inv.eventId === "1")
  },
  {
    id: "res2",
    eventId: "2",
    name: "David Clark",
    email: "david@example.com",
    inviteLink: "techconf-2025-david",
    guests: mockInvitations.filter(inv => inv.eventId === "2")
  },
  {
    id: "res3",
    eventId: "3",
    name: "Patricia Lee",
    email: "patricia@example.com",
    inviteLink: "birthday-alex-patricia",
    guests: mockInvitations.filter(inv => inv.eventId === "3")
  }
];

export function getEventById(id) {
  return mockEvents.find(event => event.id === id);
}

export function getReservationByEventId(eventId) {
  return mockReservations.find(res => res.eventId === eventId);
}

export function getInvitationByLink(link) {
  return mockInvitations.find(inv => inv.inviteLink === link);
}

export function generateInviteLink(eventId, guestName) {
  const cleanName = guestName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${eventId}-${cleanName}-${Date.now().toString(36)}`;
}

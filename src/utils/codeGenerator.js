export const generateTicketCode = (eventId, userId) => {
  if (!eventId || !userId) return "N/A";
  
  const eventPart = eventId.slice(-4).toUpperCase();
  const userPart = userId.slice(-4).toUpperCase();
  
  return `GUP-${eventPart}${userPart}`;
};
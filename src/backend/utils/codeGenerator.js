export const generateTicketCode = (eventId, userId) => {
  if (!eventId || !userId) return "N/A";
  
  const eventPart = String(eventId).slice(-4).toUpperCase();
  const userPart = String(userId).slice(-4).toUpperCase();
  
  return `GUP-${eventPart}${userPart}`;
};
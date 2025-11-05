import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {generateTicketCode} from '../utils/codeGenerator.js';
export const useTicketCode = (eventId) => {
  const { user } = useAppContext();
  const userId = user?._id;
  const ticketCode = useMemo(() => {
    return generateTicketCode(eventId, userId);
  }, [eventId, userId]);

  return ticketCode;
};
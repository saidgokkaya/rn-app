import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { CONFIG } from 'src/global-config';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

const ENDPOINT = `${CONFIG.apiUrl}/Calendar/calendars`;

const fetcher = async (url) => {
  const token = localStorage.getItem('jwt_access_token');
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(ENDPOINT, fetcher);

  const memoizedValue = useMemo(() => {
    const events = data?.map((event) => ({
      ...event,
      textColor: event.color,
    })) || [];

    return {
      events,
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !isValidating && events.length === 0,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

const CREATE_ENDPOINT = `${CONFIG.apiUrl}/Calendar/add-update-calendar`;

export async function createEvent(eventData) {
  const token = localStorage.getItem('jwt_access_token');
  const data = { eventData };

  await axios.post(CREATE_ENDPOINT, {
    id: eventData.id,
    color: eventData.color,
    title: eventData.title,
    firstName: eventData.firstName,
    lastName: eventData.lastName,
    mail: eventData.mail,
    phone: eventData.phone,
    isConfirmation: eventData.isConfirmation,
    allDay: eventData.allDay,
    description: eventData.description,
    start: eventData.start,
    end: eventData.end,
    selectedOptions: eventData.selectedOptions, 
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  mutate(
    ENDPOINT
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.put(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */

  mutate(
    ENDPOINT
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId) {
  /**
   * Work on server
   */
  
  const DELETE_ENDPOINT = `${CONFIG.apiUrl}/Calendar/delete-calendar?calendarId=${eventId}`;
  const token = localStorage.getItem('jwt_access_token');
  const response = await fetch(DELETE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  /**
   * Work in local
   */

  mutate(
    ENDPOINT
  );
}

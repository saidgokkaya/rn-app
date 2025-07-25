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

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export function useGetEvents(organization) {
  const ENDPOINT = `${CONFIG.apiUrl}/Iframe/calendars?organization=${organization}`;
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

export async function createEvent(eventData, organization) {
  const ENDPOINT = `${CONFIG.apiUrl}/Iframe/calendars?organization=${organization}`;
  const CREATE_ENDPOINT = `${CONFIG.apiUrl}/Iframe/add-calendar?organization=${organization}`;
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
  });

  mutate(
    ENDPOINT
  );
}

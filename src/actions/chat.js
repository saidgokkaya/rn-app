import { useMemo } from 'react';
import { keyBy } from 'es-toolkit';
import useSWR, { mutate } from 'swr';
import { CONFIG } from 'src/global-config';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

const fetchers = async (url) => {
  const token = localStorage.getItem('jwt_access_token');
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ----------------------------------------------------------------------

export function useGetContacts() {
  const ENDPOINT = `${CONFIG.apiUrl}/Chat/users`;

  const { data, isLoading, error, isValidating } = useSWR(ENDPOINT, fetchers);

  const memoizedValue = useMemo(
    () => ({
      contacts: data || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !isValidating && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  const conversationsUrl = `${CONFIG.apiUrl}/Chat/conversations`;

  const { data, isLoading, error, isValidating } = useSWR(conversationsUrl, fetchers);

  const memoizedValue = useMemo(() => {
    const byId = data?.length ? keyBy(data, (option) => option.id) : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !isValidating && !allIds.length,
    };
  }, [data, error, isLoading, isValidating]);
  
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId) {
  const conversationUrl = `${CONFIG.apiUrl}/Chat/conversation?conversationId=${conversationId}`;

  const { data, isLoading, error, isValidating } = useSWR(conversationUrl, fetchers);

  const memoizedValue = useMemo(
    () => ({
      conversation: data,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
      conversationEmpty: !isLoading && !isValidating && !data,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId, messageData) {
  const conversationsUrl = `${CONFIG.apiUrl}/Chat/conversations`;
  const conversationUrl = `${CONFIG.apiUrl}/Chat/conversation?conversationId=${conversationId}`;
  await axios.post(`${CONFIG.apiUrl}/Chat/add-message`, {
    conversationId: conversationId,
    messageData: {
      id: messageData.id || null,
      senderId: messageData.senderId,
      body: messageData.body,
      contentType: messageData.contentType,
      createdAt: messageData.createdAt || new Date().toISOString(),
      attachments: (messageData.attachments || []).map(a => ({
        id: a.id || null,
        name: a.name,
        path: a.path,
        preview: a.preview,
        size: a.size
      }))
    }
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_access_token")}`,
      "Content-Type": "application/json"
    }
  });

  mutate(
    conversationUrl
  );

  mutate(
    conversationsUrl
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const conversationsUrl = `${CONFIG.apiUrl}/Chat/conversations`;
  /**
   * Work on server
   */
  const res = await axios.post(`${CONFIG.apiUrl}/Chat/add-conversation`, {
      id: conversationData.id || null,
      type: conversationData.type,
      unreadCount: conversationData.unreadCount,
      messages: conversationData.messages.map((message) => ({
        id: message.id || null,
        senderId: message.senderId,
        body: message.body,
        contentType: message.contentType,
        createdAt: message.createdAt || new Date().toISOString(),
        attachments: (message.attachments || []).map((attachment) => ({
          id: attachment.id || null,
          name: attachment.name,
          path: attachment.path,
          preview: attachment.preview,
          size: attachment.size
        }))
      })),
      participants: conversationData.participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
        role: participant.role,
        status: participant.status || 'offline',
        avatarUrl: participant.avatarUrl,
        address: participant.address,
        lastActivity: participant.lastActivity || new Date().toISOString()
      }))
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_access_token")}`,
      "Content-Type": "application/json"
    }
  });

  mutate(conversationsUrl);
  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId) {
  const conversationsUrl = `${CONFIG.apiUrl}/Chat/conversations`;
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */

  mutate(conversationsUrl);
}

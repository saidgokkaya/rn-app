import { CONFIG } from 'src/global-config';

export let _workspaces = [];

export async function fetchWorkspaces() {
  try {
    const response = await fetch(`${CONFIG.apiUrl}/Organization/workspace`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Veri çekilirken hata oluştu.');
    }

    const data = await response.json();
    
    _workspaces = [
      {
        id: data.id,
        name: data.name,
      },
    ];
    
  } catch (error) {
  }
}

fetchWorkspaces();

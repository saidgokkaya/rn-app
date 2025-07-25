import axios, { endpoints } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import { toast } from 'src/components/snackbar';

/** **************************************
 * Sign in
 *************************************** */

// ----------------------------------------------------------------------

export const signInWithPassword = async ({ email, password }) => {
  try {
    const response = await axios.post(`${CONFIG.apiUrl}/auth/login`, {
      email,
      password,
    });

    if (response.data.isSuccess) {
      setSession(response.data.token);
    } else {
      throw new Error('E-posta veya şifre yanlış');
    }
  } catch (error) {
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */

// ----------------------------------------------------------------------

export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    localStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */

// ----------------------------------------------------------------------

export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

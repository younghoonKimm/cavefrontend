import { getCookie, deleteCookie } from 'cookies-next';

export const getAccessToken = () => getCookie('CAV_ACC');
export const getRefreshToken = () => getCookie('CAV_RFS');

export const resetTokens = () => {
  deleteCookie('CAV_ACC');
  deleteCookie('CAV_RFS');
};

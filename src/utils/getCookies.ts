import { getCookie, removeCookies } from 'cookies-next';

export const getAccessToken = () => getCookie('CAV_ACC');
export const getRefreshToken = () => getCookie('CAV_RFS');

export const resetTokens = () => {
  removeCookies('CAV_ACC');
  removeCookies('CAV_RFS');
};

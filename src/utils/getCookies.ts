import { hasCookie, deleteCookie } from 'cookies-next';

export const getAccessToken = () => hasCookie('CAV_ACC');
export const getRefreshToken = () => hasCookie('CAV_RFS');

export const resetTokens = () => {
  deleteCookie('CAV_ACC');
  deleteCookie('CAV_RFS');
};

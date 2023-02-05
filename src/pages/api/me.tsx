import { getProfileAPI } from '../../api/auth';

export async function getData() {
  const response = await getProfileAPI();

  console.log(response, 'res');
  return response;
}

export default async function handler(req: any, res: any) {
  const jsonData = await getData();

  return jsonData;
}

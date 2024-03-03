import { User } from './auth';

export enum ConferenceStatus {
  Reserve = 'R',
  Proceed = 'P',
  Done = 'D',
}

export interface IAgneda {
  title: string;
  text: string;
}

export interface IConference {
  id: string;
  title: string;
  status: ConferenceStatus;
  agendas: IAgneda[];
  users: Pick<User, 'name' | 'profileImg'>[];
  date: Date;
  location?: string;
  settingTime: string;
}

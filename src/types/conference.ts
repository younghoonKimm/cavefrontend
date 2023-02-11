export enum ConferenceStatus {
  Reserve = 'R',
  Proceed = 'P',
  Done = 'D',
}

export interface IConference {
  id: string;
  title: string;
  status: ConferenceStatus;
  agenda: string;
}

export interface IExperience {
  id: string;
  title: string;
  imageUrl: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

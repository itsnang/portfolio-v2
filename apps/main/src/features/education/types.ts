export interface IEducation {
  id: string;
  school: string;
  degree: string;
  logoUrl: string;
  href: string | null;
  startDate: Date;
  endDate: Date | null;
}

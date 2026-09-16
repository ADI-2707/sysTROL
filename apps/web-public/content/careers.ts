export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
}

export const careerDepartments: string[] = [
  "All Roles",
  "L2 Software Engineering",
  "Field Engineering & Commissioning",
  "Process Engineering",
  "Spares Trading & Logistics",
  "Hardware & Electrical",
];

export const vacanciesData: Vacancy[] = [];

export function getAllVacancies(): Vacancy[] {
  return vacanciesData;
}

export function getVacancyById(id: string): Vacancy | undefined {
  return vacanciesData.find((vacancy) => vacancy.id === id);
}

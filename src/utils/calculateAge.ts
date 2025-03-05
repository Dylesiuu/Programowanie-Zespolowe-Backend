import { formatDistanceToNowStrict } from 'date-fns';

export function calculateAge(birthYear: number, birthMonth: number): string {
  const birthDate = new Date(birthYear, birthMonth - 1, 1);
  return formatDistanceToNowStrict(birthDate, { unit: 'year' });
}

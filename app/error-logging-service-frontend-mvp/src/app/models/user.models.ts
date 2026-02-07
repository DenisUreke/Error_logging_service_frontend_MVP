export interface UserOut {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  role?: string;
  email: string;
  phone_number?: string;
}
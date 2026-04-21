export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  isSetup: boolean;
}

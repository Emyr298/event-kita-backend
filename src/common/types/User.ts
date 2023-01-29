export interface User {
  displayName: string | null;
  email: string | null;
  isAnonymous: boolean;
  photoURL: string | null;
  uid: string | null;
}

export const anonymousUser: User = {
  displayName: null,
  email: null,
  isAnonymous: true,
  photoURL: null,
  uid: null,
};

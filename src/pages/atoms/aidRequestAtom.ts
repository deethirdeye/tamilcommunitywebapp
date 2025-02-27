import { atom } from 'recoil';

export const selectedAidRequestState = atom<string | null>({
  key: 'selectedAidRequestState',
  default: null,
});

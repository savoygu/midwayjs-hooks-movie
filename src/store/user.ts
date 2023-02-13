import type { User } from '@prisma/client';
import { defineStore } from 'pinia';
import { checkUserExpires } from '../api/user';

type StoreUser = Pick<User, 'id' | 'name' | 'role'>;

interface UserState {
  user: StoreUser;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      user: null,
    };
  },
  actions: {
    save(user: StoreUser) {
      this.user = user;
    },
    async check() {
      const expires = await checkUserExpires();
      return expires;
    },
  },
});

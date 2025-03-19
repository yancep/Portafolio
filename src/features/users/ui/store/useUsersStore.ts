/* eslint-disable no-unused-vars */
import { BaseState, CustomPagination } from '@/src/core/api/BaseState';
import { create } from 'zustand';
import { SuccessToast } from '@/src/components/toast/SuccessToast';

import { ErrorToast } from '@/src/components/toast/ErrorToast';
import {
  RegisterUserPayload,
  UpdateUserPayload,
} from '@/src/features/authentication/data/models/payloads';
import { User } from '@/src/features/users/domain/entities/User';
import { ChangeUserPasswordPayload } from '@/src/features/users/data/models/payloads';
import { Query } from '@/src/core/api/services/url.service';
import { usersRepository } from '@/src/features/users/domain/repositories/UsersRepository';

interface UsersStore extends BaseState<CustomPagination<User>> {
  getUsers: (request: Query) => void;
  createUser: (request: RegisterUserPayload) => void;
  updateUser: (id: string, request: UpdateUserPayload) => void;
  changeUserPassword: (id: string, request: ChangeUserPasswordPayload) => void;
}

export const useUsersStore = create<UsersStore>()((setState, getState) => ({
  isLoading: false,
  data: null,
  listData: null,
  error: null,

  //Devuelve una lista de usuarios registrados
  getUsers: async (request) => {
    setState(() => ({ isLoading: true }));

    const response = await usersRepository.getUsers(request);
    if (response._tag === 'Right') {
      setState(() => ({ data: response.right, isLoading: false }));
    } else {
      setState(() => ({ error: response.left, isLoading: false }));
    }
  },

  createUser: async (data) => {
    const state = getState();
    setState(() => ({ isLoading: true }));
    const response = await usersRepository.createUser(data);

    if (response._tag === 'Left') {
      ErrorToast(response.left);
    } else {
      const updatedData =
        state.data?.data.map((user) => {
          if (user.id === response.right.id) {
            return response.right;
          }
          return user;
        }) || [];
      setState(() => ({
        data: {
          ...state.data,
          data: updatedData,
          meta: state.data?.meta || {
            itemCount: updatedData.length,
            pageCount: 1,
            next: null,
            currentPage: 1,
            nextPage: null,
            previousPage: null,
            previous: null,
          },
        },
        isLoading: false,
      }));
      SuccessToast();
    }
  },

  updateUser: async (id, data) => {
    setState(() => ({ isLoading: true }));
    const state = getState();
    const response = await usersRepository.updateUser(id, data);
    if (response._tag === 'Left') {
      setState(() => ({ error: response.left, isLoading: false }));
    } else {
      const updatedData =
        state.data?.data.map((user) => {
          if (user.id === response.right.id) {
            return response.right;
          }
          return user;
        }) || [];
      setState(() => ({
        data: {
          ...state.data,
          data: updatedData,
          meta: state.data?.meta || {
            itemCount: updatedData.length,
            pageCount: 1,
            next: null,
            currentPage: 1,
            nextPage: null,
            previousPage: null,
            previous: null,
          },
        },
        isLoading: false,
      }));
      SuccessToast();
    }
  },

  changeUserPassword: async (id, data) => {
    const response = await usersRepository.changeUserPassword(id, data);

    if (response._tag === 'Right') {
      SuccessToast();
    } else {
      ErrorToast(response.left);
    }
  },
}));

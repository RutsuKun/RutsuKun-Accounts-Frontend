import { Action, createReducer, on } from "@ngrx/store";
import { AccountState } from "./account.state";
import * as a from "./account.actions";

export const initialState: AccountState = {
  me: {
    data: null,
    loading: false,
    loaded: false,
    error: null
  },
  mfa: {
    data: {
      type: null,
      url: null,
      qrcode: null,
      secret: null,
    },
    error: null,
    loading: false,
  },
  createEmail: {
    loading: false,
    error: null
  },
  deleteEmail: {
    loading: false,
    error: null
  },
  clients: {
    data: [],
    loading: false,
    loaded: false,
    error: null
  },
  createClient: {
    loading: false,
    error: null
  },
  viewClient: {
    data: null,
    loading: false,
    error: null
  }
};

const reducer = createReducer(
  initialState,

  on(a.accountMeRequest, (state: AccountState) => ({
    ...state,
    me: {
      ...state.me,
      loading: true,
      loaded: false,
      error: null,
    },
  })),

  on(a.accountMeSuccess, (state: AccountState, { data }) => ({
    ...state,
    me: {
      data: data,
      loading: false,
      loaded: true,
      error: null,
    },
  })),

  on(a.accountMeFail, (state: AccountState, { error }) => ({
    ...state,
    me: {
      data: null,
      loading: false,
      loaded: false,
      error: error,
    },
  })),

  on(a.accountEmailsCreateRequest, (state: AccountState) => ({
    ...state,
    createEmail: {
      loading: true,
      error: null,
    },
  })),

  on(a.accountEmailsCreateSuccess, (state: AccountState, { data }) => ({
    ...state,
    me: {
      ...state.me,
      data: {
        ...state.me.data,
        emails: [...state.me.data.emails, data]
      }
    },
    createEmail: {
      loading: false,
      error: null,
    },
  })),

  on(a.accountEmailsCreateFail, (state: AccountState, { error }) => ({
    ...state,
    createEmail: {
      loading: false,
      error: error,
    },
  })),

  on(a.accountEmailsDeleteRequest, (state: AccountState) => ({
    ...state,
    deleteEmail: {
      loading: true,
      error: null,
    },
  })),

  on(a.accountEmailsDeleteSuccess, (state: AccountState, { uuid }) => ({
    ...state,
    me: {
      ...state.me,
      data: {
        ...state.me.data,
        emails: state.me.data.emails.filter((email)=>email.uuid !== uuid)
      }
    },
    deleteEmail: {
      loading: false,
      error: null,
    },
  })),

  on(a.accountEmailsDeleteFail, (state: AccountState, { error }) => ({
    ...state,
    deleteEmail: {
      loading: false,
      error: error,
    },
  })),
  
  on(a.accountClientsRequest, (state: AccountState) => ({
    ...state,
    clients: {
      data: [],
      loading: true,
      loaded: false,
      error: null,
    },
  })),

  on(a.accountClientsSuccess, (state: AccountState, { data }) => ({
    ...state,
    clients: {
      data: data,
      loading: false,
      loaded: true,
      error: null,
    },
  })),

  on(a.accountClientsFail, (state: AccountState, { error }) => ({
    ...state,
    clients: {
      data: [],
      loading: false,
      loaded: false,
      error: error,
    },
  })),

  on(a.accountClientsCreateRequest, (state: AccountState) => ({
    ...state,
    createClient: {
      loading: true,
      error: null,
    },
  })),

  on(a.accountClientsCreateSuccess, (state: AccountState) => ({
    ...state,
    createClient: {
      loading: false,
      error: null,
    },
  })),

  on(a.accountClientsCreateFail, (state: AccountState, { error }) => ({
    ...state,
    createClient: {
      loading: false,
      error: error,
    },
  })),

  on(a.accountClientFetchRequest, (state: AccountState) => ({
    ...state,
    viewClient: {
      data: null,
      loading: true,
      error: null,
    },
  })),

  on(a.accountClientFetchSuccess, (state: AccountState, { data }) => ({
    ...state,
    viewClient: {
      data,
      loading: false,
      error: null,
    },
  })),

  on(a.accountClientFetchFail, (state: AccountState, { error }) => ({
    ...state,
    viewClient: {
      data: null,
      loading: false,
      error: error,
    },
  })),

  on(a.accountMfaInitFlowRequest, (state: AccountState) => ({
    ...state,
    mfa: {
      data: null,
      error: null,
      loading: true,
    },
  })),

  on(a.accountMfaInitFlowSuccess, (state: AccountState, { data }) => ({
    ...state,
    mfa: {
      data: data,
      error: null,
      loading: false,
    },
  })),

  on(a.accountMfaInitFlowFail, (state: AccountState, { error }) => ({
    ...state,
    mfa: {
      data: null,
      error,
      loading: false,
    },
  })),

  on(a.accountMfaFinishFlowRequest, (state: AccountState) => ({
    ...state,
    mfa: {
      ...state.mfa,
      error: null,
      loading: true,
    },
  })),
  on(a.accountMfaFinishFlowSuccess, (state: AccountState) => ({
    ...state,
    mfa: {
      ...state.mfa,
      loading: false,
    },
  })),
  on(a.accountMfaFinishFlowFail, (state: AccountState, { error }) => ({
    ...state,
    mfa: {
      ...state.mfa,
      error: error,
      loading: false,
    },
  })),
);

export function accountReducer(
  state: AccountState | undefined,
  action: Action
): AccountState {
  return reducer(state, action);
}

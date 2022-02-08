import { Action, createReducer, on } from "@ngrx/store";
import { AuthState } from "./auth.state";
import * as a from "./auth.actions";

export const initialState: AuthState = {
  isAuthenticated: false,
  session: null,
  type: "auth",
  authorizeConsent: {
    client: null,
    scope: null,
  },
  signin: {
    showForm: false,
    loading: false,
    error: null,
    errors: []
  },
  signup: {
    loading: false,
    message: null,
    error: null
  },
  mfa: null,
  appInfo: {
    data: null,
    loading: false,
    loaded: false,
    error: null,
  },
};

const reducer = createReducer(
  initialState,

  on(a.authSessionFetchSuccess, (state: AuthState, { data }) => ({
    ...state,
    session: data,
  })),

  on(a.authSessionEndSuccess, (state: AuthState, { data }) => ({
    ...state,
    session: null,
  })),

  on(a.authCheckRequest, (state: AuthState) => ({
    ...state,
    signin: {
      ...state.signin,
      showForm: false,
      loadingForm: true
    }
  })),

  on(a.authCheckSuccess, (state: AuthState, { data }) => {
    if (data.type === "multifactor") {
      return {
        ...state,
        signin: {
          ...state.signin,
          showForm: true,
        },
        type: data.type,
        mfa: data.multifactor,
      };
    } else if (data.type === "consent") {
      return {
        ...state,
        signin: {
          ...state.signin,
          showForm: true,
        },
        type: data.type,
        authorizeConsent: {
          client: data.consent.client,
          scope: data.consent.scope,
        },
      };
    }
    return {
      ...state,
      signin: {
        ...state.signin,
        showForm: true,
      },
      type: data.type,
      mfa: null,
    };
  }),

  on(a.authCheckFail, (state: AuthState, { data }) => ({
    ...state,
    signin: {
      ...state.signin,
      showForm: true,
      loadingForm: false
    },
    type: data.type,
  })),

  on(a.authSigninRequest, (state: AuthState) => ({
    ...state,
    isAuthenticated: false,
    signin: {
      ...state.signin,
      loading: true,
    },
  })),

  on(a.authSigninSuccess, (state: AuthState, { data }) => ({
    ...state,
    isAuthenticated: true,
    signin: {
      ...state.signin,
      loading: false,
      error: null,
      errors: []
    }
  })),

  on(a.authSigninFail, (state: AuthState, { error, errors }) => ({
    ...state,
    isAuthenticated: false,
    signin: {
      ...state.signin,
      loading: false,
      error,
      errors
    }
  })),

  on(a.authSignupRequest, (state: AuthState) => ({
    ...state,
    signup: {
      loading: true,
      message: null,
      error: null
    }
  })),

  on(a.authSignupSuccess, (state: AuthState, { data }) => ({
    ...state,
    signup: {
      loading: false,
      message: 'Account created',
      error: null
    }
  })),

  on(a.authSignupFail, (state: AuthState, { data }) => ({
    ...state,
    signup: {
      loading: false,
      message: null,
      error: data.error
    }
  })),

  on(a.authAppInfoRequest, (state: AuthState) => ({
    ...state,
    appInfo: {
      data: null,
      loading: true,
      loaded: true,
      error: null,
    },
  })),

  on(a.authAppInfoFail, (state: AuthState, { error }) => ({
    ...state,
    appInfo: {
      data: null,
      loading: false,
      loaded: false,
      error: error,
    },
  })),

  on(a.authAppInfoSuccess, (state: AuthState, { data }) => ({
    ...state,
    appInfo: {
      data,
      loading: false,
      loaded: true,
      error: null,
    },
  }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}

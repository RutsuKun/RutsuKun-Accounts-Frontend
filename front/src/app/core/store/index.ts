import { environment } from '@env/environment';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

// state
import { AuthState } from './auth/auth.state';
import { AccountState } from './account/account.state';

// reducers
import { authReducer } from './auth/auth.reducer';

// effects
import { AuthEffects } from './auth/auth.effects';
import { accountReducer } from './account/account.reducer';
import { AccountEffects } from './account/account.effects';
import { AuthFacade } from './auth/auth.facade';
import { AccountFacade } from './account/account.facade';

export interface AppState {
    auth: AuthState;
    account: AccountState;
}

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    account: accountReducer
};

export const effects: any[] = [
    AuthEffects,
    AccountEffects
];

export const facades: any[] = [
  AuthFacade,
  AccountFacade
]

const debug = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => {
  return (state, action) => {
    const newState = reducer(state, action);
    console.log(`[DEBUG] action: ${action.type}`, {
      action: action,
      oldState: state,
      newState
    });
    return newState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [debug];
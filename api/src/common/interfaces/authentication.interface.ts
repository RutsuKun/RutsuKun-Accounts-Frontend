export type AuthenticationMethod = IAuthenticationOTP | IAuthenticationEmail | IAuthenticationSMS;
export type AuthenticationMethods = 'OTP';

export interface IAuthenticationOTP {
    type: 'OTP';
    data: {
        secret: string;
    };
}

/**
 * todo
 */
export interface IAuthenticationEmail {
    type: 'EMAIL';
}

/**
 * todo
 */
export interface IAuthenticationSMS {
    type: 'SMS';
}
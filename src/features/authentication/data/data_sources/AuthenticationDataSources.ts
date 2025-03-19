/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { generateUrlAndQuery } from '@/src/core/api/services/url.service';
import { AuthenticationRequest } from '@/src/features/authentication/domain/request/AuthenticationRequest';
import {
  DecodeTokenPayload,
  ResetPasswordEmailPayload,
  ResetPasswordPayload,
  ValidateTokenPayload,
} from '@/src/features/users/data/models/payloads';
import { AxiosInstance } from 'axios';

export interface AuthenticationDataSources {
  login : ( request : AuthenticationRequest ) => Promise<any>;
  logout : ( access : string ) => Promise<any>;
  
  decodeToken : ( request : DecodeTokenPayload ) => Promise<any>;
  
  resetPassword : ( request : ResetPasswordEmailPayload ) => Promise<any>;
  confirmPasswordReset : ( request : ResetPasswordPayload ) => Promise<any>;
  validateTokenForResetPassword : (
	request : ValidateTokenPayload,
  ) => Promise<any>;
}

const VERSION = 1;

export const AuthenticationDataSourcesImpl = (
  restClient : AxiosInstance,
) : AuthenticationDataSources => ( {
  login : function ( request ) : Promise<any> {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : `token`,
	} );
	
	return restClient.post( path, request );
  },
  
  logout : async function ( access ) : Promise<any> {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : 'users/logout/',
	} );
	
	return (
	  await restClient.post( path, {
		token : access,
	  } )
	).data;
  },
  
  validateTokenForResetPassword : async function () : Promise<any> {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : `password-reset/validate_token/`,
	} );
	
	return ( await restClient.post( path ) ).data;
  },
  
  resetPassword : async function ( request : ResetPasswordEmailPayload ) {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : 'password-reset/',
	} );
	
	return ( await restClient.post( path, request ) ).data;
  },
  
  confirmPasswordReset : async function ( request ) : Promise<any> {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : `password-reset/confirm/`,
	} );
	
	return ( await restClient.post( path, request ) ).data;
  },
  
  decodeToken : async function ( request ) : Promise<any> {
	const { path } = generateUrlAndQuery( {
	  version : VERSION,
	  basePath : `token/decode/`,
	} );
	
	return ( await restClient.post( path, request ) ).data;
  },
} );

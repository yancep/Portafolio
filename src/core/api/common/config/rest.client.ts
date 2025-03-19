import axios from 'axios';
import { SessionModel } from '@/src/features/users/domain/entities/Session';
import { TokenService } from '@/src/core/services/token/token.service';

function RestClient( tokenService : TokenService ) {
  const instance = axios.create( {
	headers : {
	  'Content-Type' : 'application/json',
	},
  } );
  
  instance.interceptors.request.use(
	async ( config ) => {
	  const session = tokenService.getSessionInCookies();
	  if ( session ) {
		config.headers[ 'Authorization' ] = `Bearer ${ session.access }`;
	  }
	  
	  const controller = new AbortController();
	  config.signal = controller.signal;
	  
	  if ( config.data instanceof FormData ) {
		config.headers[ 'Content-Type' ] = 'multipart/form-data';
	  }
	  
	  return config;
	},
	( error ) => {
	  return Promise.reject( { error } );
	},
  );
  
  instance.interceptors.response.use(
	( response ) => {
	  console.log( 'RESPONSE', response.data );
	  return response;
	},
	async ( error ) => {
	  const originalConfig = error.config;
	  
	  if ( error.response && error.response.status === 401 ) {
		const session : SessionModel | null = tokenService.getSessionInCookies();
		const refreshToken = session?.refresh;
		
		if ( !refreshToken ) {
		  tokenService.removeSession();
		  window.location.href = '/autenticar';
		  return Promise.reject( error );
		}
		
		try {
		  const response = await axios.post(
			`${ process.env.BASE_URL }/v1/token/refresh/`,
			{ refresh : refreshToken },
		  );
		  
		  const { access, refresh } = response.data;
		  
		  const newSession : SessionModel = {
			...session!,
			access : access,
			refresh : refresh,
		  };
		  
		  tokenService.setSessionInCookies( newSession );
		  
		  return instance( originalConfig );
		} catch ( refreshError : any ) {
		  if (
			refreshError.response &&
			refreshError.response.status === 401 &&
			refreshError.response.data[ 'detail' ] ===
			"El token está en lista negra"
		  ) {
			console.debug( refreshError );
			tokenService.removeSession();
			window.location.href = '/autenticar';
		  }
		  return Promise.reject( refreshError );
		}
	  }
	  
	  console.log( 'ERROR', error, 'ERROR-DATA', error.response?.data || error.message );
	  return Promise.reject( error );
	},
  );
  
  return instance;
}

export default RestClient;

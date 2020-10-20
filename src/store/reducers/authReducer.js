const initState = {
  signUpWarn: null,
  loginWarn: null,
  resetWarn: null,
  isLoading: false
}

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_AUTH_LOADING':
      return {
        ...state,
        isLoading: true
      };

    case 'CLEAR_WARN_MESSAGE':
      console.log('Cleared warn message');
      return {
        ...state,
        signUpWarn: null,
        loginWarn: null,
        resetWarn: null,
      }

    case 'SIGNUP_SUCCESS':
      console.log('Sign up success');
      return {
        ...state,
        signUpWarn: null,
        isLoading: false
      }

    case 'SIGNUP_ERROR':
      console.log('Sign up error:', action.error);
      return {
        signUpWarn: action.error.message,
        isLoading: false
      }

    case 'LOGIN_SUCCESS':
      console.log('Login success', action.user);
      return {
        ...state,
        loginWarn: null,
        isLoading: false
      }

    case 'LOGIN_ERROR':
      console.log('Login error', action.error);
      return {
        ...state,
        loginWarn: action.error.message,
        isLoading: false
      }

    case 'FB_LOGIN_SUCCESS':
      console.log('Login with fb success');
      return {
        ...state,
        loginWarn: null,
        isLoading: false
      }

    case 'FB_LOGIN_ERROR':
      console.log('Login with fb error:', action.error);
      return {
        ...state,
        loginWarn: null,
        isLoading: false
      }

    case 'SIGNOUT_SUCCESS':
      console.log('Sign out success');
      return state;

    case 'SEND_RESET_SUCCESS':
      console.log('Reset instructions sent successfuly');
      return {
        ...state,
        resetWarn: null,
        isLoading: false
      }

    case 'SEND_RESET_ERROR':
      console.log('Reset password error');
      return {
        ...state,
        resetWarn: action.error.message,
        isLoading: false
      }

    default:
      return state;
  }
}

export default authReducer
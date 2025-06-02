import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';

const API_BASE =  'http://127.0.0.1:8000/api';

// Helper function to safely parse localStorage data
const getLocalStorageUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user data from localStorage', error);
    return null;
  }
};

// Initial State
const initialState = {
  auth: {
    userInfo: getLocalStorageUser(),
    loading: false,
    error: null,
    isAuthenticated: !!getLocalStorageUser(),
    role: getLocalStorageUser()?.role || null
  },
  events: {
    data: [],
    selectedEvent: null,
    relatedEvents: [],
    loading: false,
    error: null,
    relatedLoading: false,
    relatedError: null
  },
  services: {
    data: [],
    loading: false,
    error: null
  },
  reservations: {
    data: [],
    loading: false,
    error: null
  },
  invites: {
    data: [],
    currentInvite: null,
    loading: false,
    error: null
  }
};

// Action Types
const ActionTypes = {
  // Auth Actions
  AUTH_REQUEST: 'AUTH_REQUEST',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  AUTH_LOGOUT: 'AUTH_LOGOUT',

  // Event Actions
  EVENTS_LOAD_REQUEST: 'EVENTS_LOAD_REQUEST',
  EVENTS_LOAD_SUCCESS: 'EVENTS_LOAD_SUCCESS',
  EVENTS_LOAD_FAILURE: 'EVENTS_LOAD_FAILURE',
  EVENT_LOAD_SINGLE_REQUEST: 'EVENT_LOAD_SINGLE_REQUEST',
  EVENT_LOAD_SINGLE_SUCCESS: 'EVENT_LOAD_SINGLE_SUCCESS',
  EVENT_LOAD_SINGLE_FAILURE: 'EVENT_LOAD_SINGLE_FAILURE',
  EVENT_CREATE_REQUEST: 'EVENT_CREATE_REQUEST',
  EVENT_CREATE_SUCCESS: 'EVENT_CREATE_SUCCESS',
  EVENT_CREATE_FAILURE: 'EVENT_CREATE_FAILURE',
  EVENT_DELETE_REQUEST: 'EVENT_DELETE_REQUEST',
  EVENT_DELETE_SUCCESS: 'EVENT_DELETE_SUCCESS',
  EVENT_DELETE_FAILURE: 'EVENT_DELETE_FAILURE',
  EVENT_EDIT_REQUEST: 'EVENT_EDIT_REQUEST',
  EVENT_EDIT_SUCCESS: 'EVENT_EDIT_SUCCESS',
  EVENT_EDIT_FAILURE: 'EVENT_EDIT_FAILURE',
  RELATED_EVENTS_LOAD_REQUEST: 'RELATED_EVENTS_LOAD_REQUEST',
  RELATED_EVENTS_LOAD_SUCCESS: 'RELATED_EVENTS_LOAD_SUCCESS',
  RELATED_EVENTS_LOAD_FAILURE: 'RELATED_EVENTS_LOAD_FAILURE',

  // Service Actions
  SERVICES_LOAD_REQUEST: 'SERVICES_LOAD_REQUEST',
  SERVICES_LOAD_SUCCESS: 'SERVICES_LOAD_SUCCESS',
  SERVICES_LOAD_FAILURE: 'SERVICES_LOAD_FAILURE',
  SERVICE_CREATE_REQUEST: 'SERVICE_CREATE_REQUEST',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_FAILURE: 'SERVICE_CREATE_FAILURE',
  SET_SERVICES: 'SET_SERVICES',

  // Reservation Actions
  RESERVATIONS_LOAD_REQUEST: 'RESERVATIONS_LOAD_REQUEST',
  RESERVATIONS_LOAD_SUCCESS: 'RESERVATIONS_LOAD_SUCCESS',
  RESERVATIONS_LOAD_FAILURE: 'RESERVATIONS_LOAD_FAILURE',
  RESERVATION_CREATE_REQUEST: 'RESERVATION_CREATE_REQUEST',
  RESERVATION_CREATE_SUCCESS: 'RESERVATION_CREATE_SUCCESS',
  RESERVATION_CREATE_FAILURE: 'RESERVATION_CREATE_FAILURE',

  // Invite Actions
  INVITE_LOAD_REQUEST: 'INVITE_LOAD_REQUEST',
  INVITE_LOAD_SUCCESS: 'INVITE_LOAD_SUCCESS',
  INVITE_LOAD_FAILURE: 'INVITE_LOAD_FAILURE',
  INVITE_UPDATE_REQUEST: 'INVITE_UPDATE_REQUEST',
  INVITE_UPDATE_SUCCESS: 'INVITE_UPDATE_SUCCESS',
  INVITE_UPDATE_FAILURE: 'INVITE_UPDATE_FAILURE'
};

// Action Creators
const Actions = {
  // Auth Actions
  login: (email, password) => async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.AUTH_REQUEST });

      const { data } = await axios.post(`${API_BASE}/login`, {
        email: String(email).trim(),
        password: String(password)
      });

      const userInfo = {
        token: data.access_token,
        user: data.user,
        role: data.user.role
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      
      dispatch({ 
        type: ActionTypes.AUTH_SUCCESS, 
        payload: userInfo 
      });
      
      return userInfo;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Login failed';
      dispatch({ type: ActionTypes.AUTH_FAILURE, payload: message });
      throw message;
    }
  },

  register: (userData) => async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.AUTH_REQUEST });

      const { data } = await axios.post(`${API_BASE}/register`, userData);

      const userInfo = {
        token: data.access_token,
        user: data.user,
        role: data.user.role
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      
      dispatch({
        type: ActionTypes.AUTH_SUCCESS,
        payload: userInfo
      });
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.AUTH_FAILURE, payload: message });
      throw message;
    }
  },

  logout: () => (dispatch) => {
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.AUTH_LOGOUT });
  },

  // Event Actions
  getEvents: () => async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.EVENTS_LOAD_REQUEST });
      const { data } = await axios.get(`${API_BASE}/events`);
      dispatch({
        type: ActionTypes.EVENTS_LOAD_SUCCESS,
        payload: data
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.EVENTS_LOAD_FAILURE, payload: message });
    }
  },

  getEventById: (id) => async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.EVENT_LOAD_SINGLE_REQUEST });
      const { data } = await axios.get(`${API_BASE}/events/${id}`);
      dispatch({
        type: ActionTypes.EVENT_LOAD_SINGLE_SUCCESS,
        payload: data
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.EVENT_LOAD_SINGLE_FAILURE, payload: message });
      throw message;
    }
  },

  createEvent: (eventData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.EVENT_CREATE_REQUEST });

      const { auth: { userInfo } } = getState();
      
      if (!userInfo || userInfo.role !== 'organizer') {
        throw new Error('Only organizers can create events');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(
        `${API_BASE}/events`,
        eventData,
        config
      );

      dispatch({
        type: ActionTypes.EVENT_CREATE_SUCCESS,
        payload: data
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.EVENT_CREATE_FAILURE, payload: message });
      throw message;
    }
  },

  editEvent: (eventId, eventData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.EVENT_EDIT_REQUEST });

      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.put(
        `${API_BASE}/events/${eventId}`,
        eventData,
        config
      );

      dispatch({
        type: ActionTypes.EVENT_EDIT_SUCCESS,
        payload: data
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.EVENT_EDIT_FAILURE, payload: message });
      throw message;
    }
  },

  deleteEvent: (eventId) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.EVENT_DELETE_REQUEST });

      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      await axios.delete(`${API_BASE}/events/${eventId}`, config);

      dispatch({
        type: ActionTypes.EVENT_DELETE_SUCCESS,
        payload: eventId
      });

      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.EVENT_DELETE_FAILURE, payload: message });
      throw message;
    }
  },

  loadRelatedEvents: (eventType, currentEventId) => async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.RELATED_EVENTS_LOAD_REQUEST });
      const { data } = await axios.get(`${API_BASE}/events?type=${eventType}`);
      const filtered = data.filter(event => event.id !== currentEventId).slice(0, 3);
      dispatch({ 
        type: ActionTypes.RELATED_EVENTS_LOAD_SUCCESS, 
        payload: filtered 
      });
    } catch (error) {
      dispatch({ 
        type: ActionTypes.RELATED_EVENTS_LOAD_FAILURE, 
        payload: error.message 
      });
    }
  },

  // Service Actions
  getServices: () => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.SERVICES_LOAD_REQUEST });
      
      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`
        }
      };

      const { data } = await axios.get(`${API_BASE}/services`, config);
      
      dispatch({
        type: ActionTypes.SERVICES_LOAD_SUCCESS,
        payload: data
      });
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.SERVICES_LOAD_FAILURE, payload: message });
      throw message;
    }
  },

  createService: (serviceData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.SERVICE_CREATE_REQUEST });

      const { auth: { userInfo } } = getState();
      
      if (!userInfo || userInfo.role !== 'organizer') {
        throw new Error('Only organizers can create services');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(
        `${API_BASE}/services`,
        serviceData,
        config
      );

      dispatch({
        type: ActionTypes.SERVICE_CREATE_SUCCESS,
        payload: data
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.SERVICE_CREATE_FAILURE, payload: message });
      throw message;
    }
  },

  setServices: (services) => (dispatch) => {
    dispatch({
      type: ActionTypes.SET_SERVICES,
      payload: services
    });
  },

  loadReservations: () => async (dispatch, getState) => {
  try {
    dispatch({ type: ActionTypes.RESERVATIONS_LOAD_REQUEST });

    const { auth: { userInfo } } = getState();
    
    if (!userInfo?.token) {
      throw new Error('User not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(
      `${API_BASE}/reservations/my`,
      config
    );

    dispatch({
      type: ActionTypes.RESERVATIONS_LOAD_SUCCESS,
      payload: data
    });

  } catch (error) {
    console.error("Load reservations error:", error.response?.data || error.message);
    
    dispatch({ 
      type: ActionTypes.RESERVATIONS_LOAD_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });

    throw error;
  }
},
  createReservation: (reservationData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.RESERVATION_CREATE_REQUEST });

      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post(
        `${API_BASE}/reservations`,
        reservationData,
        config
      );

      dispatch({
        type: ActionTypes.RESERVATION_CREATE_SUCCESS,
        payload: data.reservation
      });

      const inviteLink = data.invite_link.split('/').pop();
      return { ...data, inviteId: inviteLink };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.RESERVATION_CREATE_FAILURE, payload: message });
      throw new Error(message);
    }
  },

  // Invite Actions
  loadInvitations: () => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.INVITE_LOAD_REQUEST });

      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const email = userInfo.user.email;
      const { data } = await axios.get(
        `${API_BASE}/utilisateurs/${encodeURIComponent(email)}/invitations`,
        config
      );

      dispatch({
        type: ActionTypes.INVITE_LOAD_SUCCESS,
        payload: data
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.INVITE_LOAD_FAILURE, payload: message });
    }
  },

  updateInvite: (inviteId, updateData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ActionTypes.INVITE_UPDATE_REQUEST });

      const { auth: { userInfo } } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.put(
        `${API_BASE}/invites/${inviteId}`,
        updateData,
        config
      );

      dispatch({
        type: ActionTypes.INVITE_UPDATE_SUCCESS,
        payload: data
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch({ type: ActionTypes.INVITE_UPDATE_FAILURE, payload: message });
      throw message;
    }
  }
};

// Reducers
const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        isAuthenticated: true,
        role: action.payload.role,
        error: null
      };
    case ActionTypes.AUTH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ActionTypes.AUTH_LOGOUT:
      return {
        userInfo: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null
      };
    default:
      return state;
  }
};

const eventsReducer = (state = initialState.events, action) => {
  switch (action.type) {
    case ActionTypes.EVENTS_LOAD_REQUEST:
    case ActionTypes.EVENT_LOAD_SINGLE_REQUEST:
    case ActionTypes.EVENT_CREATE_REQUEST:
    case ActionTypes.EVENT_DELETE_REQUEST:
    case ActionTypes.EVENT_EDIT_REQUEST:
      return { ...state, loading: true, error: null };
      
    case ActionTypes.EVENTS_LOAD_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
      
    case ActionTypes.EVENT_LOAD_SINGLE_SUCCESS:
      return { ...state, loading: false, selectedEvent: action.payload, error: null };
      
    case ActionTypes.EVENT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [...state.data, action.payload],
        error: null
      };
      
    case ActionTypes.EVENT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter(event => event.id !== action.payload),
        error: null
      };
      
    case ActionTypes.EVENT_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
        error: null
      };
      
    case ActionTypes.RELATED_EVENTS_LOAD_REQUEST:
      return { ...state, relatedLoading: true, relatedError: null };
      
    case ActionTypes.RELATED_EVENTS_LOAD_SUCCESS:
      return { ...state, relatedLoading: false, relatedEvents: action.payload };
      
    case ActionTypes.EVENTS_LOAD_FAILURE:
    case ActionTypes.EVENT_LOAD_SINGLE_FAILURE:
    case ActionTypes.EVENT_CREATE_FAILURE:
    case ActionTypes.EVENT_DELETE_FAILURE:
    case ActionTypes.EVENT_EDIT_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case ActionTypes.RELATED_EVENTS_LOAD_FAILURE:
      return { ...state, relatedLoading: false, relatedError: action.payload };
      
    default:
      return state;
  }
};

const servicesReducer = (state = initialState.services, action) => {
  switch (action.type) {
    case ActionTypes.SERVICES_LOAD_REQUEST:
    case ActionTypes.SERVICE_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
      
    case ActionTypes.SERVICES_LOAD_SUCCESS:
    case ActionTypes.SET_SERVICES:
      return { ...state, loading: false, data: action.payload, error: null };
      
    case ActionTypes.SERVICE_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [...state.data, action.payload],
        error: null
      };
      
    case ActionTypes.SERVICES_LOAD_FAILURE:
    case ActionTypes.SERVICE_CREATE_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
};

const reservationsReducer = (state = initialState.reservations, action) => {
  switch (action.type) {
    case ActionTypes.RESERVATIONS_LOAD_REQUEST:
    case ActionTypes.RESERVATION_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
      
    case ActionTypes.RESERVATIONS_LOAD_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
      
    case ActionTypes.RESERVATION_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: [...state.data, action.payload],
        error: null
      };
      
    case ActionTypes.RESERVATIONS_LOAD_FAILURE:
    case ActionTypes.RESERVATION_CREATE_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    default:
      return state;
  }
};

const invitesReducer = (state = initialState.invites, action) => {
  switch (action.type) {
    case ActionTypes.INVITE_LOAD_REQUEST:
    case ActionTypes.INVITE_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.INVITE_LOAD_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };

    case ActionTypes.INVITE_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map(invite =>
          invite.id === action.payload.id ? action.payload : invite
        ),
        currentInvite:
          state.currentInvite?.id === action.payload.id
            ? action.payload
            : state.currentInvite,
        error: null
      };

    case ActionTypes.INVITE_LOAD_FAILURE:
    case ActionTypes.INVITE_UPDATE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};


// Root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  services: servicesReducer,
  reservations: reservationsReducer,
  invites: invitesReducer
});

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export { ActionTypes, Actions };
export default store;
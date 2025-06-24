import axios from 'axios';

const API_USUARIOS_URL = 'http://localhost:3335';
const API_RECURSOS_URL = 'http://localhost:3333';
const API_AGENDAMENTO_URL = 'http://localhost:3334';

export const apiUsuarios = axios.create({
  baseURL: API_USUARIOS_URL,
});

export const apiRecursos = axios.create({
  baseURL: API_RECURSOS_URL,
});

export const apiAgendamento = axios.create({
  baseURL: API_AGENDAMENTO_URL,
});

const addAuthToken = (config: any) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

apiUsuarios.interceptors.request.use(addAuthToken); 
apiRecursos.interceptors.request.use(addAuthToken);
apiAgendamento.interceptors.request.use(addAuthToken);


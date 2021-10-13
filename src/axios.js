import axios from 'axios';

axios.defaults.baseURL =
    process.env.NODE_ENV === 'production'
        ? 'https://vue-connect-4.herokuapp.com/'
        : `http://localhost:3001`;
axios.defaults.withCredentials = true;

export default axios;

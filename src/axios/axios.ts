import axios from "axios";

const instance = axios.create({
    baseURL: 'https://4a9d-202-166-220-144.ngrok-free.app' 
  });

  export default instance
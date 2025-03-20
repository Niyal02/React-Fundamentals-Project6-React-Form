import axios from "axios";

const instance = axios.create({
    baseURL: 'https://3c3c-202-166-220-144.ngrok-free.app' 
  });

  export default instance
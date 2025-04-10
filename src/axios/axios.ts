import axios from "axios";

const instance = axios.create({
    baseURL: 'https://36e3-110-44-118-200.ngrok-free.app/',
    headers: {
      "ngrok-skip-browser-warning": "69420",
    }
    
  });

  export default instance
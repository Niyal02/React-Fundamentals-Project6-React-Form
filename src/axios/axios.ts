import axios from "axios";

const instance = axios.create({
    baseURL: 'https://8e59-202-166-220-144.ngrok-free.app/',
    headers: {
      "ngrok-skip-browser-warning": "69420",
    }
  });

  export default instance
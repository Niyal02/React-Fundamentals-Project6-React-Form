import axios from "axios";

const instance = axios.create({
  baseURL: "https://628c-202-166-220-144.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

export default instance;

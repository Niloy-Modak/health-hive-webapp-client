import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://healthhive-server.vercel.app`
})

const useAxios = () => {
    return axiosInstance
};

export default useAxios;
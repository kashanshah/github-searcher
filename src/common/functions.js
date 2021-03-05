import axios from "axios";
import {toast} from "react-toastify";

export const createReqParams = (url, params = new FormData(), method = 'GET', cancelToken = false) => {
    var axiosParams = {
        method: method,
        url: url,
    };
    if(cancelToken && cancelToken !== ""){
        axiosParams = {
            ...axiosParams,
            cancelToken: cancelToken
        };
    }
    if(method.toLowerCase() === 'get'){
        axiosParams.params = params;
    }
    else {
        axiosParams.data = params;
    }

    return axios(axiosParams)
        .then((responseData) => {
            return responseData;
        })
        .catch(function (thrown) {
            if (axios.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
                return thrown;
            } else {
                console.warn(thrown)
                if(thrown.response){
                    return thrown.response;
                }
            }
        })
};

export const notify = (msg, type = 'error', options = {}) => {
    toast[type](msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        pauseOnHover: true,
        ...options
    });
};

export const formatDate = (inputDate = new Date()) => {
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return inputDate.getDate() + ' ' + monthsArray[inputDate.getMonth()]+', '+inputDate.getFullYear();
}

export const isAnHourAgo= (date) => {
    const hour= 1000 * 60 * 60;
    const hourago = new Date(Date.now() - hour);
    return date < hourago;
}
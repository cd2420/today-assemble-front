import axios from "axios";

export default function customAxios(methodType, url, callback) {
    axios (
        {
            url: '/api/v1' + url
            , method: methodType
            , baseURL: 'http://localhost:8080'
            , withCredentials: true
        }
    ).then(function (response) {
        callback(response.data);
    });
}
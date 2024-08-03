"use client";
import axios from 'axios';
import { HOST, TOKEN_STORAGE } from '@/utils/constants';

export const baseUrl = `${HOST[process.env.NODE_ENV]}/api`
 
export const API = axios.create({
    baseURL: baseUrl
})

API.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem(TOKEN_STORAGE);
        if(accessToken && config?.url !== "auth/login"){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
        if(error?.response?.status === 401){
            
        }
        return Promise.reject(error);
    }
);
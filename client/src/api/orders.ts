
import axios, { type AxiosRequestConfig } from 'axios';

import type { Order } from '../types';
import { orderUrl } from './endpoints';


export const createOrder = async (order: Order, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(orderUrl, order, requestConfig);
    return response.data;
};


import axios from 'axios';

import { bookUrl } from './endpoints';


export const getTags = async () => {
    const response = await axios.get(`${bookUrl}/tags`);
    return response.data;
};
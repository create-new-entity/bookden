
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createOrder } from '../api';
import { useAuthContext, useCartContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse, Order } from '../types';
import { AUTH, HOME } from '../constants';


const useCheckout = () => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const navigate = useNavigate();
    const { handleShowNotification } = useNotificationContext(); 
    const { clearCart } = useCartContext();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const orderMutation = useMutation<{ orderId: number}, AxiosErrorResponse, Order>({
        mutationFn: (order: Order) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in to checkout. Session expired or user deleted. Please try again.');
                return Promise.reject({ orderId: -1 });
            }
            console.log('resolvedToken', resolvedToken);
            return createOrder(order, resolvedToken || '');
        },
        onSuccess: (_data) => {
            navigate(HOME);
            clearCart();
            handleShowNotification('Puchase Successfully Completed. Thank you!');
        },
        onError: (_error) => {
            handleShowNotification('Something went wrong. Please try again later.');
        }
    });

    return { orderMutation };
};

export default useCheckout;
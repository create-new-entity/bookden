import { useEffect } from 'react';


export const useSetTabTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};

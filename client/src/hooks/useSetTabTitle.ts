import { useEffect } from 'react';


const useSetTabTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};

export default useSetTabTitle;
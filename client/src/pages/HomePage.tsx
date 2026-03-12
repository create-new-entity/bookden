import { useSetTabTitle } from '../hooks';

const HomePage = () => {

    useSetTabTitle('Home');

    return (
        <>
            <div>Test</div>
        </>
    );
};

export default HomePage;
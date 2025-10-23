import app from './app';
import configs from './configs';

const PORT = configs.ENV_VARIABLES.PORT;

app.listen(PORT, (error) => {
    if(error) {
        console.log('App failed to start.');
    }
    else {
        console.log(`Server listening on ${PORT}`);
    }
});
const Hapi = require('@hapi/hapi');
const routes = require('./routers');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     handler: (request, h) => {

    //         return 'Hello World!';
    //     }
    // });

    //Here requiring the all routes.
    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
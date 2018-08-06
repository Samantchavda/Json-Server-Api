const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
// Router Without api prefix
server.use(router);

// Router With api prefix
//server.use('/api', router);

// For Post , put and delete
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
      req.body.createdAt = Date.now();
      req.body.ModifiedAt = Date.now();
    }
    // Continue to JSON Server router
    next()
  })

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
});

// In this example we simulate a server side error response
router.render = (req, res) => {
    res.status(500).jsonp({
        error: "Internal Server Error"
    });
    res.status(404).jsonp({
        error: "Not Found"
    });
};

server.listen(3000, () => {
    console.log('JSON Server is running')
})


// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

// server.use(middlewares)
// server.use(router)
// server.listen(3000, () => {
//   console.log('JSON Server is running')
// })

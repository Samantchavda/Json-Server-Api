const jsonServer = require('json-server');
const fs = require('fs');
const jwt = require('jsonwebtoken')
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

var pjson = require('./package.json');

server.use(middlewares);

// For Post , put and delete
server.use(jsonServer.bodyParser);


const SECRET_KEY = '999999999'
const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token 
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

//login
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body
    if (isAuthenticated({ email, password }) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({ status, message })
        return
    }
    const access_token = createToken({ email, password })
    res.status(200).json({ access_token })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Bad authorization header'
        res.status(status).json({ status, message })
        return
    }
    try {
        var token = verifyToken(req.headers.authorization.split(' ')[1]);
        if (token != undefined && token.email != undefined) {
            next()
        } else {
            const status = 401
            const message = 'Error: ' + token.message;
            res.status(status).json({ status, message })
        }
    } catch (err) {
        const status = 401
        const message = 'Error: access_token is not valid'
        res.status(status).json({ status, message })
    }
});



server.use((req, res, next) => {
    if (req.method.toUpperCase() === 'POST') {
        req.body.createdAt = Date.now();
        req.body.ModifiedAt = Date.now();
    }
    if (req.method.toUpperCase() === 'PUT' || req.method.toUpperCase() === 'PATCH') {
        req.body.ModifiedAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});


// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
});

server.get('/status', (req, res) => {
    res.send('Server is running!!!')
});

server.get('/version', (req, res) => {
    res.jsonp({ version: pjson.version })
});



// Router Without api prefix
//server.use(router);

// Router With api prefix
server.use('/api', router);



server.listen(3000, () => {
    console.log('JSON Server is running http://localhost:3000')
});


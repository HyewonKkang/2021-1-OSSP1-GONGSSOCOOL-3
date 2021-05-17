console.clear();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// const whitelist = ['http://127.0.0.1:8080', 'http://localhost:8080'];
// const corsOptions = {
//     origin: function(origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// };

// app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

const middleware = require('./middleware');
const models = require('./models');
const router = require('./routers');

middleware.init(app);
router.init(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

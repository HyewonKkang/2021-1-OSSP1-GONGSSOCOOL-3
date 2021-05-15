console.clear();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

const router = require('./routers');
const models = require('./models');

router.init(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

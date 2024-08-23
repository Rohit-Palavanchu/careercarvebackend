const express = require('express');
const app = express();
const bookingRoutes = require('./booking');
const port = process.env.PORT || 3000;
const cors = require('cors');


app.use(cors())
app.use(express.json());
app.use('/api', bookingRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api', loanRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

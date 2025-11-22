
const PORT = process.env.PORT || 3000;
const app = require('./app');

// Start the server and listen on the specified port
app.listen(PORT, (err) => {
    if(err){
        return console.log('Error starting server:', err);
    }
    console.log(`Serving is running on port ${PORT}`);
});
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/user', (req, res, next) => {
    // next()
    res.send('Welcome to the Express TypeScript server!');
});
app.post('/user', (req, res) => {
    res.send('User created successfully!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map
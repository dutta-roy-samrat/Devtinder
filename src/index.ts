import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Express TypeScript server!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

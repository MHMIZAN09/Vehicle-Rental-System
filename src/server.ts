import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

const port = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Vehicle Rental System');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

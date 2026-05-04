import express, { type Request } from 'express';

type PostRequestBody = {
  title: string;
  content: string;
};

const app = express();
const port = 3000;

app.use(express.json()); // This line will enable parsing JSON body from all requests

app.get('/', (req: Request<{}, {}, PostRequestBody>, res) => {
  const { body } = req; // Here we can access the body directly
  console.log(
    `Received request with title: ${body.title} and content: ${body.content}`
  ); // With type casting we get type safety for body properties
  // It's still up to us to validate the body content, we are merely asserting its structure.
  // We will refine both type safety and body validation soon
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

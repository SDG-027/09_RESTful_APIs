import express from 'express';
import initDB from '#db';
import { postRouter, userRouter } from '#routers';
import { errorHandler } from '#middlewares';

await initDB();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use((request, response, next) => {
  console.log(request.body);
  console.log(request.method);
  console.log(request.url);

  request.newField = 'Hallo';

  console.log('Hallo aus der Middleware');
  next();
});

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.use('*splat', (req, res) => {
  throw new Error(`Not found | Cannot ${req.method} ${req.url}`, { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mMain app listening on port: ${port}\x1b[0m`));

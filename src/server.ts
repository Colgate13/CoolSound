import express from 'express';
import cors from 'cors';
import routes from './routes';
import { mountDatabase } from './infra/database/mountDatabase';

const PORT = 7778;

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, async () => {
  await mountDatabase();
  console.log(`Server listening on port ${PORT}`);
});

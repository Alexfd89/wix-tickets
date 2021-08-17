import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  let data = tempData
  // @ts-ignore
  const search: string = req.query.search
  // @ts-ignore
  const page: number = req.query.page || 1;

  if (search) {
    data = data.filter(t => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()))
  }

  // else if (page) {
  //   data = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // }

  res.send(data);
});
// app.get(APIPath, (req, res) => {

//   // @ts-ignore
//   const page: number = req.query.page || 1;

//   const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   res.send(paginatedData);
// });

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)


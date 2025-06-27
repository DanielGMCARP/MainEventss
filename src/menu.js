import app from './app.js'
import {connectdb} from './db.js'

connectdb();
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

import express from 'express'; 
import cors from 'cors'; 
import mangasRouter from "./routes/manga.js";

const app = express(); 
const PORT = 4020; 

app.use(cors()); 
app.use("/manga", mangasRouter);

app.get('/', (req, res) => {
	res.send('hello from server.js in the backend'); 
}); 

app.listen(PORT, () => console.log(`sup, you are listening to port ${PORT}`));

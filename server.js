import "dotenv/config";
import app from "./app.js";
import connectDb from "./DataBase/Connect.js";

await connectDb();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
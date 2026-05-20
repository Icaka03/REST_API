import dotenv from "dotenv";
dotenv.config(); // must be first so process.env is loaded

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

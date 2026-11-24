
import express from "express";

const app = express();

app.use(express.json());
app.get("/", (_, res) => {
  res.json({
    message: "Hello Express!"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});

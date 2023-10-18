const express = require("express");
const app = express();
const { initialDatabase, getAllPatients, getAllOrdersFromPatientId, insertOrderByPatientId, updateOrderByOrderId, deleteOrderById } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/getPatients", async (req, res) => {
  console.log(req.originalUrl);
  const results = await getAllPatients();
  res.status(200).json(results);
});

app.get("/order", async (req, res) => {
  console.log(req.originalUrl);
  const results = await getAllOrdersFromPatientId(req.query.patientId);
  res.status(200).json(results);
});

app.post('/order', async (req, res) => {
  const { patientId, orderId, message, isNew } = req.body;
  
  try {
    if (isNew) {
      // insert
      await insertOrderByPatientId(patientId, message);
    } else {
      // update
      await updateOrderByOrderId(orderId, message);
    }
    res.send({
      success: 1, 
      message: `${isNew ? 'INSERT' : 'UPDATE'} Complete!`,
    });
  } catch (err) {
    res.send({
      success: 0, 
      message: err,
    });
  }
});

app.delete('/order', async (req, res) => {
  const { orderId } = req.query;
  await deleteOrderById(orderId);
  res.send({
    success: 1, 
    message: "DELETE Complete!"
  });
})

app.listen(8081, () => {
  console.log("http://localhost:8081/");
});

(async () => {
  await initialDatabase();
})();

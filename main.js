const express = require("express");
const {
  deleteOrderById,
  getAllPatients,
  getAllOrdersFromPatientId,
  initialDatabase,
  insertOrderByPatientId,
  updateOrderById,
} = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Fetch all patient list.
 * Endpoint: [GET] http://localhost:8081/getPatients
 */
app.get("/getPatients", async (_, res) => {
  try {
    const results = await getAllPatients();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Fetch order list of the specific patient.
 * Endpoint: [GET] http://localhost:8081/order?patientId={0}
 */
app.get("/order", async (req, res) => {
  try {
    const results = await getAllOrdersFromPatientId(req.query.patientId);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Add or update an order data.
 * Endpoint: [POST] http://localhost:8081/order
 *
 * - Add
 *  Request Body: {
 *    "isNew": true,
 *    "patientId": 3,
 *    "message": "This is a new order message."
 *  }
 * - Update
 *  Request Body: {
 *    "orderId": 8,
 *    "message": "I'd like to modify the order message."
 *  }
 */
app.post("/order", async (req, res) => {
  const { patientId, orderId, message, isNew } = req.body;

  try {
    if (isNew) {
      // insert
      await insertOrderByPatientId(patientId, message);
    } else {
      // update
      await updateOrderById(orderId, message);
    }
    res.send({
      success: 1,
      message: `${isNew ? "INSERT" : "UPDATE"} Complete!`,
    });
  } catch (err) {
    res.send({
      success: 0,
      message: err,
    });
  }
});

/**
 * Delete an order from the table.
 * Endpoint: [DELETE] http://localhost:8081/order?orderId={0}
 */
app.delete("/order", async (req, res) => {
  const { orderId } = req.query;
  await deleteOrderById(orderId);
  res.send({
    success: 1,
    message: "DELETE Complete!",
  });
});

// Start the express RESTful API services @ http://localhost:8081
app.listen(8081, () => {
  console.log("RESTful APIs can be accessed from http://localhost:8081/");
});

(async () => {
  // Check and initialize the database schema
  await initialDatabase();
})();

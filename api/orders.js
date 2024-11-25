const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: { product: true },
    });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { date, note, productIds } = req.body;
  try {
    const products = productIds.map((id) => ({ id }));
    const order = await prisma.order.create({
      data: {
        date,
        note,
        customerId : req.user.id,
        items: { connect : products }
      },
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params
  try {
   const order = await prisma.order.findUniqueOrThrow({
     where: { id: +id },
     include: { items: true },
   });
   if (order.ownerId !== req.user.id) {
     next({ status: 403, message: "This is not your order" });
   }
   res.json(order)
  }
  catch (e) {
   next(e)
  }
 })
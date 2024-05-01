import { Order } from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import { stripe } from "../server.js";
export const CreateOrder = async (req, res, next) => {
  try {
    const {
      ShippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
      orderStatus,
    } = req.body;

    if (
      !ShippingInfo ||
      !orderItems ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount
    )
      return res.status(400).send({
        success: false,
        message: "Please Enter All Fields",
      });

    for (let i = 0; i < orderItems.length; i++) {
      const product = await ProductModel.findById(orderItems[i].product);
      if (product.stock <= 0) {
        return res.status(400).send({
          success: false,
          message: " right now Stock Is Unavialable for these product",
        });
      } else {
        product.stock = product.stock - orderItems[i].quantity;
      }
      await product.save();

      // console.log(product);
    }
    const order = await Order.create({
      user: req.user._id,
      ShippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
      orderStatus,
    });

    res.status(200).send({
      success: true,
      message: "Order Created Succesfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Order API",
    });
  }
};

export const GetMyAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders)
      return res.status(404).send({
        success: false,
        message: "orders not found",
      });

    res.status(200).send({
      success: true,
      message: "orders find successfully",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Orders API",
    });
  }
};

export const getMySingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).send({
        success: false,
        message: "order not found",
      });

    res.status(200).send({
      success: true,
      message: "Order find Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CasteError")
      return res.status(400).send({
        success: false,
        message: "Invalid ID",
      });
    res.status(500).send({
      success: false,
      message: "Error in find my one order API",
    });
  }
};
export const PaymentController = async (req, res, next) => {
  try {
    if (!req.body.id)
      return res.status(400).send({
        success: false,
        message: "plese provide Id ",
      });
    const pay = await Order.findById(req.body.id);
    if (!pay)
      return res.status(404).send({
        success: false,
        message: "not found order or Invalid ID",
      });
    const totalAmount = pay.totalAmount;
    if (!totalAmount)
      return res.status(200).send({
        success: false,
        message: "you dont have a due payment",
      });
    const secret = await stripe.paymentIntents.create({
      amount: Number(totalAmount),
      currency: "usd",
    });
    if (secret) {
      pay.paymentInfo.id = secret.id;
      pay.paymentInfo.status = secret.status;
      await pay.save();
    }
    res.status(200).send({
      success: true,
      message: `Payment confirm for amount ${totalAmount} , thank you !!! `,
      secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: " Error in Payment API",
    });
  }
};

export const getAllOrderAdmin = async (req, res, next) => {
  try {
    const order = await Order.find({});

    res.status(200).send({
      success: true,
      message: "fetched all orders",
      totalOrders: order.length,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAllOrderAdmin API",
    });
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    if (order.orderStatus === "Processing") {
      order.orderStatus = "Shipped";
    } else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Deliverd";
      order.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: true,
        message: "order allready deliverd",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "order status updated succesfully",
    });
  } catch (error) {
    if (error.name === "CasteError")
      return res.status(404).send({
        success: false,
        message: "invalid id",
      });

    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update Order Status API",
    });
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.find({ user: req.user._id });
    await Order.deleteMany({ user: req.user._id });
    if (!order)
      return res.status(404).send({
        success: false,
        message: "order not found for these user",
      });

    res.status(200).send({
      success: false,
      message: "your all orders deleted / canceled successfully",
      totalOrder: order.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Cancel All Order API",
    });
  }
};

export const cancelSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.deleteOne({ _id: req.params.id });
    if (!order)
      return res.status(404).send({
        success: false,
        message: "order not found for these user",
      });

    res.status(200).send({
      success: false,
      message: "your  orders deleted / canceled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Cancel Single Order API",
    });
  }
};

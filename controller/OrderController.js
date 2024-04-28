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
      !paymentMethod ||
      !paymentInfo ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount ||
      !orderStatus
    )
      return res.status.send({
        success: false,
        message: "Please Enter All Fields",
      });

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

    for (let i = 0; i < Order.length; i++) {
      const product = await ProductModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
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
  }

  res.status(500).send({
    success: false,
    message: "Error in find my one order API",
  });
};

export const PaymentController = async (req, res, next) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount)
      return res.status(200).send({
        success: true,
        message: "total Amount is mandatory",
      });
    const secret = stripe.paymentIntents.create({
      amount: Number(totalAmount),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      message: "Payment confirm",
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
      message: "ordere updated succesfully",
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

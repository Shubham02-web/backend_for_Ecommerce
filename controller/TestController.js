export const TestController = (req, res) => {
  res.status(200).json({
    message: "Test Route",
    Success: true,
  });
};

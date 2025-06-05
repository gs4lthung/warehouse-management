const { default: mongoose } = require("mongoose");

const checkNotFoundError = (req, res, next) => {
  console.log(`Not Found: ${req.originalUrl}`);
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

const catchAsyncHandle = (fn) => {
  return async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await fn(req, res, next, session);
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction().catch((abortErr) => {
        console.error("❌ Error aborting transaction:", abortErr);
      });
      next(error);
    } finally {
      session.endSession();

    }
  };
};


module.exports = { checkNotFoundError, catchAsyncHandle };

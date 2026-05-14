const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.createOne = (Module) =>
  catchAsync(async (req, res, next) => {
    const doc = await Module.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

module.exports.getOne = (Module, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = await Module.findById(id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`A Document Not Found With This Id : ${id}`));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

module.exports.updateOne = (Module) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Module.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`A Document Not Found With This Id : ${id}`));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

module.exports.deleteOne = (Module) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Module.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError(`A Document Not Found With This Id : ${id}`));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

module.exports.getAll = (Module) =>
  catchAsync(async (req, res, next) => {
    let features = new ApiFeatures(Module.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

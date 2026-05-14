const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "A tour must have name"],
      unique: [true, "this name is used Provide other name"],
      minLength: [10, "A Tour must have equl 10 or more then 10 characters"],
      maxLength: [40, "A Tour must have less then or equl 40 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, "A tour must have a duractions"],
    },
    maxGroupSize: {
      type: Number,
      require: [true, "A tour must have group size"],
    },
    difficulty: {
      type: String,
      require: [true, "A tour must have difficulty"],
      enum: {
        values: ["easy", "difficult", "medium"],
        message: "A Tour difficulty should be one of easy, difficult, medium",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "The minimum ratings should be more then or equal 1"],
      max: [5, "The maximum ratings should be less then or equal 5"],
      // set: (val) => Match.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "A tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: " discount price ({VALUE}) should be less then price",
      },
    },
    summary: {
      type: String,
      trim: true,
      require: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // geoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// just example
// tourSchema.index({ price: 1});
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeak").get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.pre(/^find/, function () {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   // this.aggregate({
//   //   $match: {
//   //     secretTour: { $ne: true },
//   //   },
//   // });
//   console.log(this.pipeline());

//   next();
// });

const tourModel = mongoose.model("Tour", tourSchema);

module.exports = tourModel;

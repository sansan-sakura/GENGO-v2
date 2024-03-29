import { Request, Response, NextFunction } from "express";
import { Deck } from "../models/deckModel";
import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync";
import { APIFeatures } from "../utils/apiFeature";
import { User } from "../models/userModel";
import { AppError } from "../utils/appError";
export const getAllDecks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id;
  const userStorage = await User.findOne({ clerkId: id });
  if (!userStorage)
    return res.status(400).json({ status: false, message: "There is no user with the ID" });
  const features = new APIFeatures(
    Deck.find({ user: userStorage }).populate("category").populate("cards"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const deck = await features.query;

  res.status(200).json({
    status: "200",
    results: deck.length,
    data: { deck },
  });
});

export const getDatesOfDeck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Deck.find({ category: new mongoose.Types.ObjectId(req.params.id) })
        .populate("category")
        .populate("cards")
        .select({
          createdAt: 1,
          last_reviewed_date: 1,
          reviewed_date: 1,
        }),
      req.query
    );

    const deck = await features.query;

    res.status(200).json({
      status: "200",
      results: deck.length,
      data: { deck },
    });
  }
);

export const getAllDatesOfDeck = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Deck.find().populate("category").populate("cards").select({
        createdAt: 1,
        last_reviewed_date: 1,
        reviewed_date: 1,
      }),
      req.query
    );

    const deck = await features.query;

    res.status(200).json({
      status: "200",
      results: deck.length,
      data: { deck },
    });
  }
);

export const getDecksByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchObj =
      req.params.id === "all" ? {} : { category: new mongoose.Types.ObjectId(req.params.id) };
    const features = new APIFeatures(
      Deck.find({ category: new mongoose.Types.ObjectId(req.params.id) })
        .populate("category")
        .populate("cards"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const deck = await features.query;

    res.status(200).json({
      status: "200",
      results: deck.length,
      data: { deck },
    });
  }
);

export const createDeck = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization;
  const userStorage = await User.findOne({ accessToken: accessToken });
  if (!userStorage)
    return res.status(400).json({ status: false, message: "There is no user with the ID" });

  const { title, category } = req.body;
  const body =
    category === "all"
      ? { title: title, user: userStorage }
      : { title: title, user: userStorage, category: category };

  const newDeck = await Deck.create(body);
  res.status(201).json({
    status: "success",
    data: {
      newDeck,
    },
  });
});

export const getDeck = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deck = await Deck.findById(req.params.id).populate("category").populate("cards");
  res.status(201).json({
    status: "success",
    cards: deck.cards,
    data: {
      deck,
    },
  });
});

export const deleteDeck = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    data: null,
  });
});

export const updateDeck = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!deck) {
    return next(new AppError("No Deck found with that ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      deck,
    },
  });
});

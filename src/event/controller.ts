import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Event, { IEvent, eventSchema } from "./model";
import corn from "node-cron";

corn.schedule("0 0 * * * *", () => {
  console.log("Run corn job");
  checkEventExpiration();
});

//Add new event
export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldevent: any = await Event.findOne({
      name: req.body.name,
      createdBy: mongoose.Types.ObjectId(req.userId),
    }).exec();
    if (oldevent) {
      res.status(409).json({ error: "You have created this event before" });
      return;
    }
    const newEvent = new Event(req.body);
    newEvent._id = new mongoose.Types.ObjectId();
    newEvent.createdBy = mongoose.Types.ObjectId(req.userId);
    newEvent.save();
    res.status(200).json({ data: newEvent });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

// Edit event
export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const editedEvent: any = req.body;

    const oldEvent: any = await Event.findOne({ _id: eventId }).exec();
    if (!oldEvent) {
      res.status(404).json({ error: "The event not found" });
      return;
    }

    if (oldEvent.createdBy.toString() !== req.userId) {
      res
        .status(403)
        .json({ error: "You dont have permission to edit this event" });
      return;
    }
    for (let key in editedEvent) {
      oldEvent[key] = editedEvent[key];
    }

    const result = await Event.updateOne({ _id: eventId }, { $set: oldEvent });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// List of all event
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Event.find().exec();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

// Details of event
export const detail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id).exec();
    if (!event) {
      res.status(404).json({ error: "The event not found" });
      return;
    }
    res.status(200).json({ data: event });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

//Delete event
export const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    const event: any = await Event.findOne({ _id: eventId }).exec();
    if (!event) {
      res.status(404).json({ error: "The event not found" });
      return;
    }

    if (event.createdBy.toString() !== req.userId) {
      res
        .status(403)
        .json({ error: "You dont have permission to edit this event" });
      return;
    }

    const result = await Event.deleteOne({ _id: eventId }).exec();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ data: error });
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const oldEvent: any = await Event.findOne({ _id: eventId }).exec();
    if (!oldEvent) {
      res.status(404).json({ error: "The event not found" });
      return;
    }

    const result = await Event.updateOne(
      { _id: eventId },
      { $addToSet: { registeredUsers: userId } }
    );
    res.status(200).json({ data: "Register to event successfully." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const unregister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const oldEvent: any = await Event.findOne({ _id: eventId }).exec();
    if (!oldEvent) {
      res.status(404).json({ error: "The event not found" });
      return;
    }

    const result = await Event.updateOne(
      { _id: eventId },
      { $pull: { registeredUsers: userId } }
    );
    res.status(200).json({ data: "Unregister from event successfully." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

async function checkEventExpiration() {
  try {
    const allEvents = await Event.find({}).exec();

    allEvents.forEach(async (inputEvent: IEvent, index: number, array) => {
      if (inputEvent.endDate < Date.now()) {
        if (inputEvent.status !== "closed") {
          const result = await Event.updateOne(
            { _id: inputEvent._id },
            { $set: { status: "closed" } }
          );
          console.log(result);
        }
      }
    });
  } catch (error) {
    console.log("ERROR IN CORN JOB");
    console.log(error);
  }
}

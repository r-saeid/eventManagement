import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User, { Iuser, userSchema } from "./model";

describe("controller test", () => {
  test("function 1", () => {
    expect(50).toEqual(50);
  });
});

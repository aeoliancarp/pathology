/* eslint-disable no-var */
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var db: {
    conn: typeof mongoose | null,
    mongoMemoryServer: MongoMemoryReplSet | null,
    promise: Promise<typeof mongoose> | null,
  };
}

export {};

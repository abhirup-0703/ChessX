import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  roomId: string;        // References the PostgreSQL ChatRoom ID
  senderId: string;      // References the PostgreSQL User ID
  text?: string;         // Optional because a message might just be an image
  imageUrl?: string;     // Cloudinary URL for media
  readBy: string[];      // Array of User IDs who have seen it
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    roomId: { type: String, required: true, index: true }, // Indexed for fast lookups
    senderId: { type: String, required: true },
    text: { type: String },
    imageUrl: { type: String },
    readBy: { type: [String], default: [] },
  },
  { 
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
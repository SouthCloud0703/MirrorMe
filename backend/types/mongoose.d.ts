declare module 'mongoose' {
  import { EventEmitter } from 'events';
  
  // Schema
  export class Schema {
    constructor(definition: any, options?: any);
    static Types: SchemaTypes;
  }
  
  // SchemaTypes
  export interface SchemaTypes {
    ObjectId: any;
  }
  
  // Document
  export interface Document {
    _id: any;
    save(): Promise<this>;
  }
  
  // DeleteResult
  export interface DeleteResult {
    acknowledged: boolean;
    deletedCount: number;
  }
  
  // Model
  export interface Model<T extends Document> {
    new(data?: any): T;
    create(data: any): Promise<T>;
    findOne(conditions: any): Promise<T | null>;
    findById(id: any): Promise<T | null>;
    find(conditions?: any): Promise<T[]>;
    findByIdAndUpdate(id: any, update: any, options?: any): Promise<T | null>;
    findOneAndUpdate(conditions: any, update: any, options?: any): Promise<T | null>;
    updateMany(conditions: any, update: any, options?: any): Promise<any>;
    deleteMany(conditions: any): Promise<DeleteResult>;
  }
  
  // Mongoose
  export function model<T extends Document>(name: string, schema: Schema): Model<T>;
  export function connect(uri: string, options?: any): Promise<typeof mongoose>;
  
  // MongooseのObjectId
  export namespace Types {
    export class ObjectId {
      constructor(id?: string | number | ObjectId);
      toString(): string;
    }
  }
  
  // Exportするmongooseインスタンス
  const mongoose: {
    connect: typeof connect;
    model: typeof model;
    Schema: typeof Schema;
    Types: typeof Types;
  };
  
  export default mongoose;
} 
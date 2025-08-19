export function toJSON<T extends { _id?: any; __v?: any }>(doc: T) {
  const obj: any = { ...(doc as any) };
  obj.id = obj._id?.toString?.() ?? obj.id;
  delete obj._id; 
  delete obj.__v;
  return obj;
}
import * as mongoose from "mongoose"
export const convertToMongoObjectId = (mongooseId: string)=>{
    return new mongoose.Types.ObjectId(mongooseId)
}
export const filterValidMongoObjectIdList = (mongooseIds: string[])=>{
    if(mongooseIds && mongooseIds.length > 0){
        return mongooseIds.filter(mongoId=> mongoose.Types.ObjectId.isValid(mongoId))
    }
}
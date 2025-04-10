import mongoose from 'mongoose'

const categorySchema = new mongoose.schema({
    name :{
        type :string,
        required : true,
        unique :true,
    },
    //go to npm js and write for slugify
    //then install slugify
    slug:{
        type :string, 
        lowercase :true,
    }
});
export default mongoose.model("category",categorySchema);
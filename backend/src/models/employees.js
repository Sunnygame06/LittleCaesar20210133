import mongoose, {Schema, model} from "mongoose";

const employeeSchema = new Schema({
    name:{type: String},
    lastname:{type: String},
    DUI:{type: String},
    birthdate:{type: Date},
    email:{type: String},
    password:{type: String},
    isVerified: {type: Boolean},
    status:{type: String},
    idBranches:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branches"
    }
},{
    timestamps: true,
    strict: false
});

export default model("Employees", employeeSchema)
import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        defualt: false
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User
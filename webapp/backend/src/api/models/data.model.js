const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    temp: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true
    },
    bmp_temp:{
        type: Number,
        required: true
    },
    pres: {
        type: Number,
        required: true
    },
    alt: {
        type: Number,
        required: true
    },
    ts : { 
        type : Date,
        default: Date.now
    },
}, {timestamps: true})

dataSchema.pre('save', async function save(next) {
    try {
        
        this.ts = new Date(this.ts * 1000)

        return next();
    } catch (error) {
        next(error)
    }
})

dataSchema.statics = {
    getLastRecord: async function () {
        const lastData = await this.find({}).sort({ts: -1}).limit(1).exec()
        return lastData[0]
    }
}

const Data = mongoose.model('weather_data', dataSchema);
module.exports = Data;
const Data = require("../models/data.model")

exports.getLatestValue = async (req, res, next) => {
    const lastData = await Data.getLastRecord()
    res.status(200).json(lastData)
}
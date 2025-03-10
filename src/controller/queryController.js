const QueryUserSchema = require("../models/QueryUserSchema");
exports.postNewQuery = async (req, res) => {
  try {
    const { userId, name, query } = req.body;
    const timestamp = Date.now();
    const timestampDateAndTime = new Date(timestamp).toISOString();

    let queryUser = await QueryUserSchema.findOne({ userId });

    if (queryUser) {
      queryUser.timestampDateAndTime = timestampDateAndTime;
      queryUser.timestamp = timestamp;
      queryUser.query.push({ ...query, timestampDateAndTime, timestamp });
      await queryUser.save();
      return res.status(200).json(queryUser);
    } else {
      queryUser = new QueryUserSchema({
        userId,
        name,
        timestampDateAndTime,
        timestamp,
        query: [{ ...query, timestampDateAndTime, timestamp }],
      });
      await queryUser.save();
      return res.status(201).json(queryUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllQuery = async (req, res) => {
  try {
    const queryUsers = await QueryUserSchema.find().sort({ timestamp: -1 });
    res.status(200).json(queryUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getQueryByUserId = async (req, res) => {
  try {
    const queryUser = await QueryUserSchema.find({ userId: req.params.id });
    if (!queryUser) {
      return res.status(404).json({ message: "Query user not found" });
    }
    res.status(200).json(queryUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

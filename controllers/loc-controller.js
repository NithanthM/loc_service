
const updateLocationHistory = (req, res) => {
    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || !latitude || !longitude || !timestamp) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    res.status(200).json({
        message: 'Location history updated successfully',
        data: { userId, latitude, longitude, timestamp },
    });
};

module.exports = {
    updateLocationHistory,
};

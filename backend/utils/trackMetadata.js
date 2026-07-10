const fs = require('fs');
const path = require('path');

const getTrackMetadata = (trackId) => {
  try {
    const filePath = path.join(__dirname, '..', 'metadata', `${trackId}.json`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);

    return parsedData[trackId];
  } catch (error) {
    console.error(`Error reading metadata file for track: ${trackId}`, error);
    return null;
  }
};

module.exports = { getTrackMetadata };

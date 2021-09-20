import axios from "axios";

export const getStreetViewImage = async () => {
  const URL= `https://maps.googleapis.com/maps/api/streetview?location=41.403609,2.174448&size=456x456&key=AIzaSyBuaRNo3x--g4-B8KaZ2Osg6N-xJynsA0o`
  const response = await axios.get(URL);
  return response.data
};

import axios from "axios";

export const getStreetViewImage = async (point) => {
  console.log(point)
  const URL = `https://maps.googleapis.com/maps/api/streetview?location=0.235514,2.174448&size=456x456&key=AIzaSyBuaRNo3x--g4-B8KaZ2Osg6N-xJynsA0o`;
  return axios
    .get(URL, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      const buffer = Buffer.from(response.data, "base64");
      return buffer;
    })
    .catch((err) => {
      console.log(err);
    });
};

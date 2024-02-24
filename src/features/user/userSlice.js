import { getAddress } from "../../services/apiGeocoding";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAdress = createAsyncThunk(
  "user/fetchAdress",
  async function () {
    // user's geolocation
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // reverse geocoding API
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // return an object
    return { position, address };
  },
);

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAdress.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAdress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAdress.rejected, (state, action) => {
        state.status = "error";
        state.error =
          "User's geolocation is denied. Make sure to fill this field!";
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

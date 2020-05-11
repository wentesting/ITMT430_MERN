import { combineReducers } from "redux";
import {
  authenticateSlice,
  userSlice,
  adminSlice,
  itemSlice
} from "../slice/setSlice";
const appReducers = combineReducers({
  isAuthenticate: authenticateSlice.reducer,
  setUser: userSlice.reducer,
  setItem: itemSlice.reducer,
  setAdmin: adminSlice.reducer
});

export default appReducers;

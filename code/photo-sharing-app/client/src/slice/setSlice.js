import { createSlice } from "@reduxjs/toolkit";

export const authenticateSlice = createSlice({
  name: "authenticate",
  initialState: false,
  reducers: {
    setAuthenticate: state => (state = true),
    setUnAuthenticate: state => (state = false)
  }
});

export const userSlice = createSlice({
  name: "userData",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const adminSlice = createSlice({
  name: "adminData",
  initialState: {},
  reducers: {
    setAdmin: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const itemSlice = createSlice({
  name: "itemData",
  initialState: {},
  reducers: {
    setItem: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const requestSlice = createSlice({
  name: "requestData",
  initialState: {},
  reducers: {
    setRequest: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

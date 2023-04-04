import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
   QuerySearch: '',
   trackInfo: null,
   rawData: [],
   duration: 0,
   currentTime: 0,
   isPlaying: false,
   shouldPlay: false,
   wasPlaying: false,
   arcRadius: 50,
};

export const audioSlice = createSlice({
   name: 'audioDatas',
   initialState: initialState,
   reducers: {
      setQuerySearch: (state, action) => {
         state.QuerySearch = action.payload;
      },
      setTrackInfo: (state, action) => {
         state.trackInfo = action.payload;
      },
      setDuration: (state, action) => {
         state.duration = action.payload;
      },
      setCurrentTime: (state, action) => {
         state.currentTime = action.payload;
      },
      setIsPlaying: (state, action) => {
         state.isPlaying = action.payload;
      },
      setShouldPlay: (state, action) => {
         state.shouldPlay = action.payload;
      },
      setWasPlaying: (state, action) => {
         state.wasPlaying = action.payload;
      },
      setArcRadius: (state, action) => {
         state.arcRadius = action.payload;
      },
      setRawData: (state, action) => {
         state.rawData = action.payload;
      },
      resetStore: () => initialState,
   },
   extraReducers: {
      [HYDRATE]: (state, action) => {
         return {
            ...state,
            ...action.payload.audio,
         };
      },
   },
});

export const {
   setQuerySearch,
   setTrackInfo,
   setDuration,
   setCurrentTime,
   setIsPlaying,
   setShouldPlay,
   setWasPlaying,
   setArcRadius,
   setRawData,
   resetStore,
} = audioSlice.actions;

export default audioSlice.reducer;

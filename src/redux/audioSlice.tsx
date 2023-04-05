import { createSlice, AnyAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
   QuerySearch: '',
   trackInfo: null,
   clickedTrack: null,
   rawData: [],
   duration: 0,
   currentTime: 0,
   isPlaying: false,
   audioSource: null,
   audioContext: null,
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
      setClickedTrack: (state, action) => {
         state.clickedTrack = action.payload;
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
      setAudioSource: (state, action) => {
         state.audioSource = action.payload;
      },
      setAudioContext: (state, action) => {
         state.audioContext = action.payload;
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
   extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action: AnyAction) => {
         return { ...state, ...action.payload.filmsList };
      });
   },
});

export const {
   setQuerySearch,
   setTrackInfo,
   setClickedTrack,
   setDuration,
   setCurrentTime,
   setIsPlaying,
   setAudioSource,
   setAudioContext,
   setShouldPlay,
   setWasPlaying,
   setArcRadius,
   setRawData,
   resetStore,
} = audioSlice.actions;

export default audioSlice.reducer;

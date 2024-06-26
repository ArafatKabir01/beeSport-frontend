import { apiSlice } from "../../api/apiSlice";

export const leagueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopLeagues: builder.query({
      query: () => `/api/leagues`
    })
  })
});

export const { useGetTopLeaguesQuery } = leagueApi;

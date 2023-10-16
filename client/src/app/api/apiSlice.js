import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

// It's a common pattern for dealing with JWT authentication, where access tokens have a short lifespan, and a refresh token is used to get a new access token without requiring the user to log in again.

// This setup ensures that every API call made using this API service includes necessary credentials and handles token refresh if needed.

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/",
  credentials: "include", // ensures that cookies, including HTTP-only cookies (if any), are sent with every request.
  prepareHeaders: (headers, { getState }) => {
    // this is a function that adds the "Authorization" header with a Bearer token if a token is available in the Redux state
    //const token = getState().auth.token;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYXp1c2EiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiZXhwIjoxNjk3NDUwODg4fQ.U6RL-0W51IqDHEKyWxlLt0qMYAshBpRVPc-spAgV6wk";
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// This is an extension of the base query function (baseQuery) that handles token refresh if the server returns a 403 (Forbidden) error, indicating an expired access token.
const baseQueryWithTokenReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // if access token is expired
  if (result?.error?.originalState === 403) {
    console.log("sending refresh token");
    //sends a request to "/refresh" to get a new access token using a refresh token.
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log("refreshResult", refreshResult);

    // If the refresh is successful, it updates the stored credentials (token) and retries the original request.
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // retry the original request with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If the refresh token is expired or the refresh fails, it logs the user out.
      // likely error is 401 Unauthorized
      api.dispatch(logOut());
    }
  }
  return result;
};

// based on baseQuery, you can set other endpoints.
// endpoints injected in authApiSlice.js
export const apiSlice = createApi({
  baseQuery: baseQueryWithTokenReauth,
  endpoints: (builder) => ({}),
});

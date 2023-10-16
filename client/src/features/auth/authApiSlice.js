import { apiSlice } from "../../app/api/apiSlice";

// `login` Provides a login function to trigger the login action. This function sends a request to the server to authenticate the user.
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;

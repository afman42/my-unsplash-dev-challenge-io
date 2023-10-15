import { UseFetchReturn, createFetch } from "@vueuse/core";
import Noty from "noty";

const myUseFetch = createFetch({
  baseUrl: "http://localhost:3000",
});

export type IPhotos = {
  id: number;
  label: string;
  photoUrl: string;
};

interface APIError {
  error: number;
  message: string;
}

const notification = (text: string, type: Noty.Type) => {
  new Noty({
    type,
    text,
    timeout: 500,
    progressBar: true,
  }).show();
};

export const apiGet = (query: string = ""): UseFetchReturn<Array<IPhotos>> => {
  return myUseFetch(query !== "" ? `/search?nameLabel=${query}` : "/all")
    .get()
    .json();
};

// https://github.com/vueuse/vueuse/pull/2711#issuecomment-1540643959
export const apiPostFetch = async (payload: {
  label: string;
  photoUrl: string;
}) => {
  return myUseFetch("/create", {
    //@ts-ignore
    afterFetch(ctx: { data: string; response: Response | null }) {
      notification("Successfully Add", "success");
      ctx.data = JSON.parse(ctx.data);
      return ctx;
    },
    onFetchError(ctx: {
      data: string;
      response: Response | null;
      error: Error & { apiError?: APIError };
    }) {
      const contentType = ctx.response?.headers.get("content-type") ?? "";

      if (contentType.startsWith("application/json")) {
        if (typeof ctx.data === "string") {
          try {
            ctx.error.apiError = JSON.parse(ctx.data);
            const jsParse = JSON.parse(ctx.data);
            if (jsParse.photoUrl) {
              const errPhotoUrl = jsParse.photoUrl._errors;
              for (let index = 0; index < errPhotoUrl.length; index++) {
                let msg = errPhotoUrl[index];
                if (msg !== undefined) {
                  notification(msg, "alert");
                }
              }
            }

            if (jsParse.label) {
              const errLabel = jsParse.label._errors;
              for (let index = 0; index < errLabel.length; index++) {
                const msg = errLabel[index];
                notification(msg, "alert");
              }
            }
          } catch {
            // Ignore
            ctx.error.apiError = {
              error: 0,
              message: "",
            };
          }
        }
      }

      return ctx;
    },
  }).post(payload, "json");
};

export const apiDeleteFetch = async (payload: string, id: number) => {
  return myUseFetch(`/delete/${id}`, {
    //@ts-ignore
    afterFetch(ctx: { data: string; response: Response | null }) {
      const jsParse = JSON.parse(ctx.data);
      notification(jsParse.data, "success");
      return ctx;
    },
    onFetchError(ctx: {
      data: string;
      response: Response | null;
      error: Error & { apiError?: APIError };
    }) {
      const contentType = ctx.response?.headers.get("content-type") ?? "";

      if (contentType.startsWith("application/json")) {
        if (typeof ctx.data === "string") {
          try {
            ctx.error.apiError = JSON.parse(ctx.data);
            const jsParse = JSON.parse(ctx.data);
            if (jsParse.data) {
              notification(jsParse.data, "warning");
            }
            if (jsParse.passwordInput) {
              const errpasswordInput = jsParse.passwordInput._errors;
              for (let index = 0; index < errpasswordInput.length; index++) {
                const msg = errpasswordInput[index];
                notification(msg, "alert");
              }
            }
          } catch {
            // Ignore
            ctx.error.apiError = {
              error: 0,
              message: "",
            };
          }
        }
      }

      return ctx;
    },
  }).delete({ passwordInput: payload }, "json");
};

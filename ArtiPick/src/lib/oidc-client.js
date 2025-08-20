import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const managers = new Map();

function createSettings(provider) {
  if (typeof window === "undefined") {
    return {
      authority: "",
      client_id: "",
      redirect_uri: "",
      userStore: undefined,
    };
  }

  const redirect = import.meta.env.VITE_OIDC_REDIRECT_URI;
  const common = {
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    post_logout_redirect_uri: window.location.origin,
  };

  if (provider === "kakao") {
    return {
      authority    : "https://kauth.kakao.com",
      client_id    : import.meta.env.VITE_KAKAO_REST_KEY,
      redirect_uri : redirect,
      response_type: "code",
      scope        : "openid account_email profile_nickname profile_image",
      ...common,
    };
  }

  if (provider === "google") {
    return {
      authority    : "https://accounts.google.com",
      client_id    : import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri : redirect,
      response_type: "code",
      scope        : "openid email profile",
      ...common,
    };
  }

  throw new Error("Unsupported provider: " + provider);
}

export function getUserManager(provider = "kakao") {
  if (!managers.has(provider)) {
    managers.set(provider, new UserManager(createSettings(provider)));
  }
  
  return managers.get(provider);
}
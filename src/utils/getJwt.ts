import constants from "../constants";
import { AddBlogAgentPayload, Data, DefaultBlogAgent } from "../store";

const isAuthenticatedResponse = (res: Response, logout: Function): boolean => {
  if (res.status === 401){
    window.localStorage.removeItem("langface-auth");
    logout();
    return false;
  }
  return true;
};

function deleteCookie(): void {
  window.localStorage.removeItem("langface-auth");
}

const getUserAuthToken = (): string => {
  return window.localStorage.getItem('langface-auth') || '';
}

const getJwt = async (setToken: (token: string) => void, setError: (error: string) => void): Promise<void | null> => {
  const oauth2Endpoint: string = "https://accounts.google.com/o/oauth2/v2/auth";
  const params: {[key: string]: string} = {
    client_id: "704178374790-ifgbedjlnfm7cpgjrdju7n1psbmm88j8.apps.googleusercontent.com",
    redirect_uri: constants.localUrl,
    response_type: "token",
    scope: "https://www.googleapis.com/auth/blogger",
    include_granted_scopes: "true",
    state: "pass-through value",
  };
  const url: string = oauth2Endpoint + "?" + Object.keys(params).map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
  const newWin = window.open(url, "_blank");
  const tokenCheckInterval = setInterval(() => {
    try {
      const url = newWin?.location.href;
      try {
        if (newWin?.location?.href?.includes("access_token")) {
          clearInterval(tokenCheckInterval);
          const newWinURI = newWin.location.href;
          const token = newWinURI.substring(newWinURI.indexOf("access_token=") + 13, newWinURI.indexOf("&token_type"));
          newWin.close();
          setToken(token);
          return;
        }
      } catch (e) {
        setError("Failed to login with Google. Please try again.");
        return null;
      }
    } catch (e) {}
  }, 50);
};

const wordpressGetJwt = async (setError: (error: string) => void, fetchWordpress: (code: string) => void): Promise<void | null> => {
  const client_id: number = constants.WP_CLIENT_ID;
  const redirect_url: string = constants.localUrl;
  const url: string = `https://public-api.wordpress.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_url}&response_type=code`;
  const newWin = window.open(url, "_blank");
  const tokenCheckInterval = setInterval(() => {
    try {
      const url = newWin?.location.href;
      try {
        if (newWin?.location?.href?.includes("code")) {
          clearInterval(tokenCheckInterval);
          const urlObj = new URL(newWin.location.href);
          const params = new URLSearchParams(urlObj.search);
          const code = params.get("code");
          newWin.close();
          if (code) fetchWordpress(code);
          return;
        }
      } catch (e) {
        setError("Failed to login with Wordpress. Please try again.");
        return null;
      }
    } catch (e) {}
  }, 500);
};

interface Blog {
  userID?: string,
  [key: string]: any
}

interface Session {
  url?: string,
  [key: string]: any
}

async function createCheckoutSession(): Promise<AddBlogAgentPayload | boolean> {
  const oauth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${constants.url}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-access'langface-auth-token": getUserAuthToken() || '',
          "referral-id": window.localStorage.getItem("referral-id") || ''
        },
      });
      const session: Session = await response.json();
      if (!session.url) {
        return false;
      }
      const stripeWindow = window.open(session.url);
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          try {
            if (stripeWindow?.location.href.includes('?success=true')) {
              stripeWindow.close();
              clearInterval(checkInterval);
              resolve(true);
              return;
            } else if (stripeWindow?.location.href.includes('?canceled=true')) {
              stripeWindow.close();
              clearInterval(checkInterval);
              resolve(false);
              return;
            }
          } catch (error) {
          }
          if (stripeWindow?.closed) {
            clearInterval(checkInterval);
            resolve(false);
          }
        }, 500);  // Check every half second
      });
    } catch {
      return false;
    }
  }
  function pollUserPermissions(): Promise<AddBlogAgentPayload> {
    return new Promise((resolve) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`${constants.url}/checkForNewBlog`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "x-access'langface-auth-token": getUserAuthToken() || '',
            },
          });
          const blog: AddBlogAgentPayload = await response.json();
          if (blog.userID) {
            clearInterval(pollInterval);
            resolve(blog);
          }
        } catch (error) {
        }
      }, 2000);
    });
  }
  const auth = await oauth();
  if (!auth) {
    return false;
  }
  const blog = await pollUserPermissions();
  return blog;
}

export { getJwt, wordpressGetJwt, deleteCookie, getUserAuthToken, createCheckoutSession, isAuthenticatedResponse };

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie } from "./utils/getJwt";
import constants from "./constants";

export type DefaultBlogAgent = {
  businessData: BusinessData,
  postsLeftToday: number,
  daysLeft: number,
  loops: number,
  jwt: string,
  blogID: string,
  data: any[],
  hasStarted?: boolean,
  maxNumberOfPosts: number,
  version: string,
  dropDownTitle: string,
  demo: boolean,
  settingUp?: boolean,
  includeAIImages: boolean
};

export type RootState = {
  main: State
}

export type BusinessData = {
  name: string,
  product: string,
  valueProposition: string,
  insights: string[],
  links: LinksBusinessData[]
};

export type LinksBusinessData = {
  url: string,
  description: string
};

export type AddBlogAgentPayload = {
  version?: string;
  maxNumberOfPosts?: number;
  postsLeftToday?: number;
  daysLeft?: number;
  loops?: number;
  jwt?: string;
  blogID?: string;
  messages?: Array<BusinessData>; // Adjust the type if necessary
  _id: string;
  businessData: BusinessData;
  includeAIImages?: boolean;
  dropDownTitle?: string;
  demo?: boolean;
  userID?: string;
};

export type Data = {
  version: string;
  title: string;
  img: string | boolean;
  type: 'error' | 'success' | 'tree';
  config: any; // Replace 'any' with a specific type if possible
  url?: string;
  html?: string;
  tree?: string;
  onClick?: () => void | false;
}

interface Blog {
  version: string;
  maxNumberOfPosts: number;
  postsLeftToday: number;
  daysLeft: number;
  loops: number;
  jwt: string;
  blogID: string;
  data: Data[];
  hasStarted: boolean; // added property
  businessData: Record<string, any>;
  includeAIImages: boolean;
  _id: string;
}

export interface LoginPayload {
  blogs: Blog[];
  user: any;
}

export type BannerMessage = {
  message: string;
  type?: string;
  timeout?: number;
}

export type State = {
  tabId: string,
  bannerMessage: BannerMessage | null,
  currentView: string,
  htmlModal: string,
  isLoggedIn: boolean,
  showSideBar: boolean,
  blogIds: string[],
  user: any,
  activeBlogAgent: string,
  blogAgents: Record<string, DefaultBlogAgent>
};

export type ReduxState = {
  main: State
};


const defaultBlogAgent: DefaultBlogAgent = {
    businessData: {
      name: "",
      product: "",
      valueProposition: "",
      insights: [],
      links: [],
    },
    postsLeftToday: constants.maxPosts,
    daysLeft: 0,
    loops: 3,
    jwt: "",
    blogID: "",
    data: [],
    hasStarted: false,
    maxNumberOfPosts: constants.maxPosts,
    version: "html",
    dropDownTitle: "New Agent",
    demo: true,
    settingUp: true,
    includeAIImages: false,
};

const initialState: State = {
  tabId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  bannerMessage: null,
  currentView: "launch",
  htmlModal: "",
  isLoggedIn: false,
  showSideBar: false,
  blogIds: [],
  user: {},
  activeBlogAgent: "default",
  blogAgents: {"default" : defaultBlogAgent}
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setHtmlModal: (state : State, action : PayloadAction<string>) => {
      state.htmlModal = action.payload;
    },
    setBlogIds (state : State, action : PayloadAction<string[]>) {
      const res = [...state.blogIds, ...action.payload];
      //remove duplicates without using a set
      state.blogIds = res.filter((item, index) => res.indexOf(item) === index);
    },
    addBlogAgent: (state : State, action: PayloadAction<AddBlogAgentPayload>) => {
      const { version, maxNumberOfPosts, postsLeftToday, daysLeft, loops, jwt, blogID, messages, _id, businessData, includeAIImages, dropDownTitle, demo } = action.payload;
      const tempBlog: DefaultBlogAgent = {
        version: version || "html",
        maxNumberOfPosts: maxNumberOfPosts || 0,
        postsLeftToday: postsLeftToday || 0,
        daysLeft: daysLeft || 0,
        loops: loops || 3,
        jwt: jwt || "",
        blogID: blogID || "",
        data: messages || [],
        hasStarted: false,
        businessData: businessData,
        includeAIImages: includeAIImages || false,
        settingUp: !businessData?.name || !businessData?.product,
        dropDownTitle: dropDownTitle || "New Agent",
        demo: demo || false
      }
      state.blogAgents[_id] = tempBlog;
      state.activeBlogAgent = _id;
    },
    setActiveBlogAgent: (state : State, action: PayloadAction<string>) => {
      state.activeBlogAgent = action.payload;
    },
    updatebusinessData: (state : State, action) => {
      state.blogAgents[state.activeBlogAgent].businessData = {...state.blogAgents[state.activeBlogAgent].businessData, ...action.payload};
    },
    login: (state, action: PayloadAction<LoginPayload>) => {
      var { blogs, user } = action.payload;
      if (!blogs || blogs.length === 0) {
        return {...state, isLoggedIn: true, user, showSideBar: true  }
      };
      const blogMap: Record<string, DefaultBlogAgent> = {};
      for (let blog of blogs) {
        const { version, maxNumberOfPosts, postsLeftToday, daysLeft, loops, jwt, blogID, data, hasStarted, businessData, includeAIImages, _id } = blog;

        const tempBusinessData: BusinessData = {
          name: businessData?.name || "",
          product: businessData?.product || "",
          valueProposition: businessData?.valueProposition || "",
          insights: businessData?.insights || [],
          links: businessData?.links || []
        };

        const tempBlog: DefaultBlogAgent = {
          version: version || "html",
          maxNumberOfPosts: maxNumberOfPosts || 0,
          postsLeftToday: postsLeftToday || 0,
          daysLeft: daysLeft || 0,
          loops: loops || 3,
          jwt: jwt || "",
          blogID: blogID || "",
          data: data || [],
          hasStarted: hasStarted || false,
          businessData: tempBusinessData,
          includeAIImages: includeAIImages || false,
          settingUp: !businessData.name || !businessData.product,
          dropDownTitle: "New Agent",
          demo: false,
        }
        blogMap[_id] = tempBlog;
      }
      return {...state, isLoggedIn: true, blogAgents: blogMap, user: user, activeBlogAgent: Object.keys(blogMap)[0], showSideBar: true}
    },    
    toggleSideBar: (state : State, action : PayloadAction<boolean>) => {
      if (action.payload !== undefined) {
        state.showSideBar = action.payload;
      } else {
        state.showSideBar = !state.showSideBar;
      }
    },
    setVersion: (state : State, action : PayloadAction<{activeBlogAgent: string, version : string}>) => {
      const { activeBlogAgent, version } = action.payload;
      state.blogAgents[activeBlogAgent].version = version;
    },
    signOut: (state : State) => {
      deleteCookie();
      state.isLoggedIn = false;
      state.user = {};
      state.blogAgents = {"default" : defaultBlogAgent};
      state.activeBlogAgent = "default";
      state.currentView = 'launch';
      state.showSideBar = false;
    },
    setBannerMessage: (state : State, action: PayloadAction<BannerMessage>) => {
      state.bannerMessage = action.payload;
    },
    clearBannerMessage: (state : State) => {
      state.bannerMessage = null;
    },
    setCurrentView: (state : State, action : PayloadAction<string>) => {
      state.bannerMessage = null;
      state.currentView = action.payload;
    },
    updateBlogAgent (state : State, action) {
      const { id } = action.payload;
      state.blogAgents[id] = {...state.blogAgents[id], ...action.payload};
    },
    updateBlogAgentData: (state : State, action) => {
      const { blogId, type, title, url, html, tree, config, postsLeftToday, maxNumberOfPosts, hasStarted, daysLeft } = action.payload;
      const data = { type, title, url, config, html, tree };
    
      if (action.payload.action === "buyNow") {
        state.bannerMessage = {type: 'success', message: "Hire a pro agent to post more blogs today."}
      }
      state.blogAgents[blogId].hasStarted = hasStarted;
      if (daysLeft === 0) {
        state.blogAgents[blogId].daysLeft = 0
      } else {
        state.blogAgents[blogId].daysLeft = daysLeft || state.blogAgents[blogId].daysLeft;
      }
      if (state.blogAgents[blogId].data.length > 0 && state.blogAgents[blogId].data[state.blogAgents[blogId].data.length - 1].type === "updating") {
        state.blogAgents[blogId].data.pop();
      }
      state.blogAgents[blogId].data.push(data);
      if (postsLeftToday === 0) {
        state.blogAgents[blogId].postsLeftToday = 0
      } else {
        state.blogAgents[blogId].postsLeftToday = postsLeftToday || state.blogAgents[blogId].postsLeftToday;
      }
      state.blogAgents[blogId].maxNumberOfPosts = maxNumberOfPosts || state.blogAgents[blogId].maxNumberOfPosts;
    },

    initializeBlogAgent: (state : State, action) => {
      const { maxNumberOfPosts, postsLeftToday, daysLeft, loops, jwt, blogID, version, dropDownTitle, demo, _id, businessData, includeAIImages } = action.payload;
      const mapActualsTooInputs : DefaultBlogAgent = { maxNumberOfPosts, daysLeft, loops, jwt, blogID, version, dropDownTitle, demo, data: [], hasStarted: true, postsLeftToday, businessData, includeAIImages};
      if (!state.blogAgents[_id]) {
        delete state.blogAgents[state.activeBlogAgent];
        state.activeBlogAgent = _id;
      }
      state.blogAgents[_id] = mapActualsTooInputs;
    },
  },
});


const isAuthorized = (state : ReduxState): boolean => {
  const { blogAgents } = state.main;
  let res = false;
  // cast object to array
  const blogArray = Object.values(blogAgents);
  console.log(blogArray);
  blogArray.forEach(blog => {
      if (!blog.demo) {
          res = true;
      }
  });
  return res;
}


type ReduxHelpers = {
  isAuthorized: (state: ReduxState) => boolean
}





// Now we configure the store
const store = configureStore({ reducer: { main: slice.reducer } });
export default store;
export const actions = { ...slice.actions};
export const reduxHelpers : ReduxHelpers = { isAuthorized };
export const { setBannerMessage, setBlogIds, clearBannerMessage, setVersion, setCurrentView, updateBlogAgentData, login, signOut, setActiveBlogAgent, initializeBlogAgent, addBlogAgent, setHtmlModal } = slice.actions;



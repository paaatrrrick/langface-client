import { DefaultBlogAgent } from "../store";

const trimStringToChars = (str: string, N: number): string => {
    if (str.length > N) {
        return str.substring(0, N - 3) + "...";
    } else {
        return str;
    }
}


const hasNonDemoBlog = (blogs: Record<string, DefaultBlogAgent>): boolean => {
    let res = false;
    // cast object to array
    const blogArray = Object.values(blogs);
    blogArray.forEach(blog => {
        if (!blog.demo) {
            res = true;
        }
    });
    return res;
}

export { trimStringToChars, hasNonDemoBlog };

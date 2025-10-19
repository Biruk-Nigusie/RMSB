import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(({ file }) => {
    console.log("Profile image uploaded:", file.url);
    return { url: file.url };
  }),
  
  documents: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "8MB" },
  }).onUploadComplete(({ file }) => {
    console.log("Document uploaded:", file.url);
    return { url: file.url };
  }),
};
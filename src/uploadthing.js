import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(({ file }) => {
    console.log("Profile image uploaded:", file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),
  
  documents: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "8MB" },
  }).onUploadComplete(({ file }) => {
    console.log("Document uploaded:", file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),
};
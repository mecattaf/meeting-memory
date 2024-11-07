export type Recording = {
  url: string;
  blob: Blob;
  id: string;
};

export type Note = {
  id: number;
  text: string;
  audioUrls?: string[] | null;
  createdAt: string;
  updatedAt: string;
};

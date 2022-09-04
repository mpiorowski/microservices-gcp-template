export type CloudFile = {
  id: string;
  filename: string;
  targetId: string;
  type: FileType | null;
  url: string | null;
};

export enum FileType {
  INFO = 'INFO',
}

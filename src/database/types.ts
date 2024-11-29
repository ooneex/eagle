export type VectorDatabaseConfigType = {
  url: string;
  table: string;
  openai?: {
    key: string;
    model: string;
  };
  mistral?: {
    key: string;
    model: string;
  };
};

export interface IVectorDatabase {
  getConfig: () => VectorDatabaseConfigType;
}

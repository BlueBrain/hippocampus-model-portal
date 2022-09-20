
export type TableEntry = {
  from: string;
  to: string;
  mean: number;
  sd: number | string;
  sem: number | string;
  species: string;
  age?: string;
  weight?: string;
  region: string;
  nAnimals: number | string;
  nCells: number | string;
  ref: string;
};

import { createContext } from 'react';
import { ParsedUrlQuery } from 'querystring';


export type ServerSideContextType = {
  query: ParsedUrlQuery,
  params?: ParsedUrlQuery,
};

const ServerSideContext = createContext<ServerSideContextType | null>(null);


export default ServerSideContext;

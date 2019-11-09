import axios from "axios";
import { coreURI } from ".";

export const evProdInstance = axios.create({
  baseURL: coreURI
});

import { create } from "apisauce";
import GlobalVars from "../GlobalVars";
const clientApi = create({
 baseURL: GlobalVars.serverIP,
 headers: { Accept: 'application/vnd.github.v3+json' },
})
export default clientApi
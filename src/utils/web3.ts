import { AbstractProvider, ethers, JsonRpcProvider } from "ethers"
import { NetworkUtil } from "./networks";
import { Eip1193Provider } from "@safe-global/protocol-kit";


export const getJsonRpcProvider = async(chainId: number): Promise<JsonRpcProvider> => {

    console.log("Use JsonRpcProvider")
    
    return new ethers.JsonRpcProvider(NetworkUtil.getNetworkById(chainId)?.url)
}
import CryptoPoops from "../contracts/ExampleNFT.cdc"

pub fun main(): UInt64 {
    return CryptoPoops.totalSupply
}
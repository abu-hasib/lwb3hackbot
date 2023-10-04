import CryptoPoops from "../contracts/ExampleNFT.cdc"

pub fun main() {
    let acct1 = getAccount(0x2cd15cc7890127f9)
let acct1Capability = acct1.getCapability(/public/public)
    log("Acct balance")
    log(acct1.availableBalance)
}
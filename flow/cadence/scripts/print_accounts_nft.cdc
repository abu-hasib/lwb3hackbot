import ExampleNFT from "../contracts/ExampleNFT.cdc"

// Print the NFTs owned by account 0x01.
pub fun main() {
    // Get the public account object for account 0x01
    let nftOwner = getAccount(0x2cd15cc7890127f9)

    // Find the public Receiver capability for their Collection
    let capability = nftOwner.getCapability<&{ExampleNFT.NFTReceiver}>(ExampleNFT.CollectionPublicPath)

    // borrow a reference from the capability
    let receiverRef = capability.borrow()
            ?? panic("Could not borrow receiver reference")

    // Log the NFTs that they own as an array of IDs
    log("Account 1 NFTs")
    log(receiverRef.getIDs())
}
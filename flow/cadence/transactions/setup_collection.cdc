import CryptoPoops from "../contracts/ExampleNFT.cdc"

transaction() {
    prepare(signer: AuthAccount) {
        // Store a `CryptoPoops.Collection` in our storage
        signer.save(<- CryptoPoops.createEmptyCollection(), to: /storage/MyCollection)

        // make public
        signer.link<&CryptoPoops.Collection>(/public/MyCollection, target: /storage/MyCollection)
    }
}
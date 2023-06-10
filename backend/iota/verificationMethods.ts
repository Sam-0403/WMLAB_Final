import { Account, MethodContent, ExplorerUrl } from '@iota/identity-wasm/node'
import { loadDID } from './loadDid'
/**
 * Adds a verification method to a DID Document and publishes it to the tangle.
 *
 * @param name Name of DID holder to locate Stronghold file in `/stronghold-files/<name>.hodl`.
 * @param password Stronghold password.
 * @param fragment Fragment of new verifcation method.
 */
async function addVerificationMethod(
  name: string,
  password: string,
  fragment: string
) {
  console.log(name, password, fragment)
  const account: Account = await loadDID(name, password)
  console.log(account)

  try{
    await account.createMethod({
      content: MethodContent.GenerateEd25519(),
      fragment,
    })
  }
  catch(err){
    console.log(err)
    return true
  }

  console.log('Creating Method Successful!')
  console.log(`Explorer Url:`, ExplorerUrl.mainnet().resolverUrl(account.did()))
  return false
}

export { addVerificationMethod }

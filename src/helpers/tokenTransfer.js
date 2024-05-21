import * as SolanaWeb3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
const getOrCreateAssociatedTokenAccount = async (connection,
  mint,
  owner, wallet) => {
    const associatedToken = await splToken.getAssociatedTokenAddress(mint, owner);

    let account;
    try{
      account = await splToken.getAccount(connection, associatedToken);
    }catch (error){
      if (error instanceof splToken.TokenAccountNotFoundError || error instanceof splToken.TokenInvalidAccountOwnerError){
        try{
          const transaction = new SolanaWeb3.Transaction().add(
            splToken.createAssociatedTokenAccountInstruction(
              wallet.publicKey,
              associatedToken,
              owner,
              mint
            )
          );
          
          await wallet.sendTransaction(transaction, connection);
        }catch(error){

        }
        account = await splToken.getAccount(connection, associatedToken);
      }else{
        throw error;
      }
    }
    return account;
}
export const transfer= async (toAddress,amount, wallet, tokenMintAddress)=> {
  //if (!wallet.connected || !wallet.publicKey) {
    if (!wallet.connected) {
      setLoggerBuf(b => {
        const arr = [...b];
        arr.push({
          error: "Please Connect Wallet",
          color: "red"
        });
        return arr;
      });
    return;
  }
const connection = new SolanaWeb3.Connection("https://api.devnet.solana.com/");
const mintPublicKey = new SolanaWeb3.PublicKey(tokenMintAddress);  
const {TOKEN_PROGRAM_ID} = splToken;
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                mintPublicKey,
                wallet.publicKey,
                wallet
              );
const destPublicKey = new SolanaWeb3.PublicKey(toAddress);
const associatedDestinationTokenAddr = await getOrCreateAssociatedTokenAccount(
                connection,
                mintPublicKey,
                destPublicKey,
                wallet
              );
//const instructions: solanaWeb3.TransactionInstruction[] = [];
const instructions = [];

instructions.push(
                splToken.createTransferInstruction(
                  fromTokenAccount.address,
                  associatedDestinationTokenAddr.address,
                  wallet.publicKey,
                  amount,
                  [],
                  TOKEN_PROGRAM_ID
                )
              );

const transaction = new SolanaWeb3.Transaction().add(...instructions);
const blockhash = await connection.getLatestBlockhash();
transaction.feePayer = wallet.publicKey;
transaction.recentBlockhash = blockhash.blockhash;
//change1
const signed = await wallet.signTransaction(transaction);
const transactionSignature = await connection.sendRawTransaction(
                signed.serialize(),
              { skipPreflight: true }
              );
// const transactionSignature = await connection.sendRawTransaction(
//                 transaction.serialize(),
//                 { skipPreflight: true }
//               );
              const strategy = {
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockhash.lastValidBlockHeight,
                signature: transactionSignature
              }
              await connection.confirmTransaction(strategy);
              console.log("Confirmed");
}
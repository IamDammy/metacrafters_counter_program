import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { assert } from "chai"



describe("counter_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // const handler = new anchor.web3.PublicKey('HmJDt8FGpSQYTdvnQq7kmiJoxDWLiw9EtXFooWy7bo8R')

  const provider = anchor.getProvider();

  const program = anchor.workspace.CounterProgram as Program<CounterProgram>;

  const user = anchor.web3.Keypair.generate();

  const seed = Buffer.from('counter');
  const [counter] = anchor.web3.PublicKey.findProgramAddressSync(
    [user.publicKey.toBuffer(), seed],
    program.programId
  );

  it("Initialize Counter", async () => {

    const airdrop = await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);

    const blockhashInfo = await provider.connection.getLatestBlockhash()

    await provider.connection.confirmTransaction({ ...blockhashInfo, signature: airdrop }, 'confirmed')

    const preBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    const tx = await program.methods.initialize()
      .accounts({
        counter: counter,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([user])
      .rpc();

    await provider.connection.confirmTransaction({ ...blockhashInfo, signature: tx }, 'confirmed')

    console.log("Your transaction signature", tx);

    const expected = await program.account.counterAccount.fetch(counter, 'confirmed')
    const postBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    assert(preBalance > postBalance, 'signer is payer')
    assert(expected.count.eq(new anchor.BN(0)), 'counter account initialized value is 0.')
    assert(expected.authority.equals(user.publicKey), 'authority of counter account is the signer.')

  });

  it("Increment Counter", async () => {

    const blockhashInfo = await provider.connection.getLatestBlockhash()

    const preBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    const tx = await program.methods.increment()
      .accounts({
        counter: counter,
        authority: user.publicKey
      })
      .signers([user])
      .rpc();

    await provider.connection.confirmTransaction({ ...blockhashInfo, signature: tx }, 'confirmed')

    console.log("Your transaction signature", tx);

    const expected = await program.account.counterAccount.fetch(counter, 'confirmed')
    const postBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    assert(preBalance === postBalance, 'program is payer')
    assert(expected.count.eq(new anchor.BN(1)), 'counter account increment from 0 to 1.')
  });

  it("Decrement Counter", async () => {

    const blockhashInfo = await provider.connection.getLatestBlockhash()

    const preBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    const tx = await program.methods.decrement()
      .accounts({
        counter: counter,
        authority: user.publicKey
      })
      .signers([user])
      .rpc();

    await provider.connection.confirmTransaction({ ...blockhashInfo, signature: tx }, 'confirmed')

    console.log("Your transaction signature", tx);

    const expected = await program.account.counterAccount.fetch(counter, 'confirmed')
    const postBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    assert(preBalance === postBalance, 'program is payer')
    assert(expected.count.eq(new anchor.BN(0)), 'counter account decrement from 1 to 0.')
  });

  it("Mulitple Increments", async () => {

    const blockhashInfo = await provider.connection.getLatestBlockhash()

    const preBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    const inc = await program.methods.increment()
      .accounts({
        counter: counter,
        authority: user.publicKey
      }).prepare()

    const tx = await program.methods.increment()
      .postInstructions([inc.instruction])
      .accounts({
        counter: counter,
        authority: user.publicKey
      })
      .signers([user])
      .rpc();

    await provider.connection.confirmTransaction({ ...blockhashInfo, signature: tx }, 'confirmed')

    console.log("Your transaction signature", tx);

    const expected = await program.account.counterAccount.fetch(counter, 'confirmed')
    const postBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

    console.log(expected)

    assert(preBalance === postBalance, 'program is payer')
    assert(expected.count.eq(new anchor.BN(2)), 'counter account increment from 0 to 2 via two increment instructions of transaction.')

  });


});



























































// describe("counter_program", () => {
//   anchor.setProvider(anchor.AnchorProvider.env());
//   const provider = anchor.getProvider();

//   const program = anchor.workspace.CounterProgram as Program<CounterProgram>;
//   let counter = anchor.web3.Keypair.generate();

//   before(async () => {
//     // Create and initialize the data account
//     await program.methods
//       .initialize()
//       .accounts({
//         counter: counter.publicKey,
//         user: provider.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//       })
//       .signers([counter])
//       .preInstructions([
//         await program.account.counter.createInstruction(counter),
//       ])
//       .rpc();
//   });

//   it("initializes the counter", async () => {
//     const account = await program.account.counter.fetch(counter.publicKey);
//     assert.equal(account.count, 0, "The counter should be initialized to 0");
//   });

//   it("increments the counter", async () => {
//     await program.methods
//       .increment()
//       .accounts({
//         counter: counter.publicKey,
//       })
//       .rpc();

//     const account = await program.account.counter.fetch(counter.publicKey);
//     console.log("Value after increment:", account.value);
//     assert.equal(account.value, 1, "The value should be incremented to 1");
//   });


//   it("Decrement Counter", async () => {

//     const blockhashInfo = await provider.connection.getLatestBlockhash()

//     const preBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

//     const tx = await program.methods.decrement()
//       .accounts({
//         counter: counter.publicKey,
//         //authority: user.publicKey
//       })
      
//       .rpc();

//     await provider.connection.confirmTransaction({ ...blockhashInfo, signature: tx }, 'confirmed')

//     console.log("Your transaction signature", tx);

//     const expected = await program.account.counterAccount.fetch(counter, 'confirmed')
//     const postBalance = await provider.connection.getBalance(user.publicKey, 'confirmed')

//     assert(preBalance === postBalance, 'program is payer')
//     assert(expected.count.eq(new anchor.BN(0)), 'counter account decrement from 1 to 0.')
//   });






















//   it("decrements the counter", async () => {
//     await program.methods
//       .decrement()
//       .accounts({
//         counter: counter.publicKey,
//       })
//       .rpc();

//     const account = await program.account.counter.fetch(counter.publicKey);
//     console.log("Value after decrement:", account.value);
//     assert.equal(account.value, 0, "The value should be decremented to 0");
//   });
// });







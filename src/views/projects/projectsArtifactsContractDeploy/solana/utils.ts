import {  Keypair, Connection, Transaction,} from "@solana/web3.js";

export class ClientTx {
    static async confirm(txHash: string, conn: Connection) {
        const result = await conn.confirmTransaction(txHash);
        if (result?.value.err) return {
            err: 1
        };
    }

    static async send(
        tx: Transaction,
        conn: Connection,
        walletKp: Keypair,
        additionalSigners? : any[]
    ) {
        tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
        tx.feePayer = walletKp.publicKey;

        if (additionalSigners?.length) {
            tx.partialSign(...additionalSigners);
        }
        tx.partialSign(walletKp);

        console.log("send transaction: ", tx)

        return await conn.sendRawTransaction(tx.serialize(), {
            skipPreflight: true,
        });
    }

    static async sendWithWallet(
        tx: Transaction,
        conn: Connection,
        walletKp: any,
    ) {

        tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
        tx.feePayer = walletKp.publicKey;
        // console.error("walletKp",walletKp)
        let signed = await walletKp.signTransaction(tx);

        console.log("send transaction: ",signed)

        return await conn.sendRawTransaction(signed.serialize(), {
            skipPreflight: true,
        });
    }

}

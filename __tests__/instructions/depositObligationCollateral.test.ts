import { PublicKey ,TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import { depositObligationCollateralInstruction} from "../../src/instructions";
import { LendingInstruction } from "../../src/instructions/instruction";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../../src/utils/layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
jest.setTimeout(50_000);


describe("deposit obligation collateral instruction", function () {
    const collateralAmount = new BN(120_340_560_789);
    const destinationCollateral = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const depositReserve = new PublicKey("64oqP1dFqqD8NEL4RPCpMyrHmpo31rj3nYxULVXvayfW");
    const sourceCollateral= new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const obligation = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
    const transferAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");
    const lendingMarket = new PublicKey("76pWmCRuVqHKsPSUph5X7xQ6bZho3apXXEdSNvr11Yvx");
    const solendProgramAddress = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const obligationOwner = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");

  

      let txnIxs=   depositObligationCollateralInstruction(
        collateralAmount ,//amount
        destinationCollateral,//user collateral account 
        sourceCollateral,//collateral supply 
        depositReserve,//reserve address
        obligation, // obligation address
        lendingMarket,//lending market 
        obligationOwner, // obligationOwner
        transferAuthority, // transferAuthority
        solendProgramAddress
      )
   
      const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        Layout.uint64("collateralAmount"),
    ]);


      it("should create a valid deposit obligation collateral instruction", () => {
        expect(txnIxs).toBeInstanceOf(TransactionInstruction);
        expect(txnIxs).toHaveProperty("programId", solendProgramAddress);
        expect(txnIxs).toHaveProperty("keys");
        expect(txnIxs).toHaveProperty("data");
    });

    it("returned instruction should have correct program id", () => {
        expect(txnIxs.programId).toBeInstanceOf(PublicKey);
        expect(txnIxs.programId).toEqual(solendProgramAddress);
    });


    it("returned instruction should have correct keys", () => {
        expect(txnIxs.keys).toHaveLength(8);
        expect(txnIxs.keys).toContainEqual(   { pubkey: sourceCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(   { pubkey: destinationCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(  { pubkey: depositReserve, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual(  { pubkey: obligation, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarket, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: obligationOwner, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual(    { pubkey: transferAuthority, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });

    it("returned instruction should have correct data", () => {
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositObligationCollateral,
                collateralAmount: new BN(collateralAmount),
            },
            data
        );
        expect(txnIxs.data).toBeInstanceOf(Uint8Array);
        expect(txnIxs.data).toEqual(data);
        expect(dataLayout.decode(txnIxs.data).instruction).toBe(LendingInstruction.DepositObligationCollateral);
        expect(dataLayout.decode(txnIxs.data).collateralAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(txnIxs.data).collateralAmount.toNumber()).toEqual(collateralAmount.toNumber());
    });

    it("should work with Number as well as BN", () => {
        const collateralAmountNumber = 1234; // Number instead of BN
        const anotherTxnIxs = depositObligationCollateralInstruction(
            collateralAmountNumber ,//amount
            destinationCollateral,//user collateral account 
            sourceCollateral,//collateral supply 
            depositReserve,//reserve address
            obligation, // obligation address
            lendingMarket,//lending market 
            obligationOwner, // obligationOwner
            transferAuthority, // transferAuthority
            solendProgramAddress
          )
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositObligationCollateral,
                collateralAmount: new BN(collateralAmountNumber),
            },
            data
        );
        expect(dataLayout.decode(anotherTxnIxs.data).collateralAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(anotherTxnIxs.data).collateralAmount.toNumber()).toEqual(collateralAmountNumber);

      });


    })
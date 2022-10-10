import { PublicKey ,TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import { borrowObligationLiquidityInstruction} from "../../src/instructions";
import { LendingInstruction } from "../../src/instructions/instruction";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../../src/utils/layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

jest.setTimeout(50_000);

//Testst for all core instructions
describe("borrow obligation liquidity instruction", function () {
    const borrowAmount = new BN(120_340_560_789);
    const destinationLiquidity = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const borrowReserve = new PublicKey("64oqP1dFqqD8NEL4RPCpMyrHmpo31rj3nYxULVXvayfW");
    const sourceLiquidity = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const  borrowReserveLiquidityFeeReceiver= new PublicKey("Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR");
    const obligation = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
    const lendingMarketAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");
    const lendingMarket = new PublicKey("76pWmCRuVqHKsPSUph5X7xQ6bZho3apXXEdSNvr11Yvx");
    const solendProgramAddress = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const hostFeeReceiver = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const obligationOwner = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");

    let txnIxs=borrowObligationLiquidityInstruction(
        borrowAmount,//amount to be borrowed
        sourceLiquidity,//reserve liquidity address
        destinationLiquidity,//destinationLiquidity
        borrowReserve,//reserve address
        borrowReserveLiquidityFeeReceiver,// borrowReserveLiquidityFeeReceiver
        obligation,//obligation 
        lendingMarket, // lendingMarket
        lendingMarketAuthority, // lendingMarketAuthority
        obligationOwner,//obligationOwner
        solendProgramAddress,//solend program address
        hostFeeReceiver
      )

      const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        Layout.uint64("borrowAmount"),
    ]);

    
      it("should create a valid borrow obligation instruction", () => {
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
        expect(txnIxs.keys).toHaveLength(10);
        expect(txnIxs.keys).toContainEqual(  { pubkey: sourceLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: destinationLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: borrowReserve, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(   {
            pubkey: borrowReserveLiquidityFeeReceiver,
            isSigner: false,
            isWritable: true,
          });
        expect(txnIxs.keys).toContainEqual(  { pubkey: obligation, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarket, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual( { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: obligationOwner, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });

    it("returned instruction should have correct data", () => {
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.BorrowObligationLiquidity,
                borrowAmount: new BN(borrowAmount),
            },
            data
        );
        expect(txnIxs.data).toBeInstanceOf(Uint8Array);
        expect(txnIxs.data).toEqual(data);
        expect(dataLayout.decode(txnIxs.data).instruction).toBe(LendingInstruction.BorrowObligationLiquidity);
        expect(dataLayout.decode(txnIxs.data).borrowAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(txnIxs.data).borrowAmount.toNumber()).toEqual(borrowAmount.toNumber());
    });

    it("should work with Number as well as BN", () => {
        const borrowAmountNumber = 1234; // Number instead of BN
        const anotherTxnIxs =borrowObligationLiquidityInstruction(
            borrowAmountNumber,//amount to be borrowed
            sourceLiquidity,//reserve liquidity address
            destinationLiquidity,//destinationLiquidity
            borrowReserve,//reserve address
            borrowReserveLiquidityFeeReceiver,// borrowReserveLiquidityFeeReceiver
            obligation,//obligation 
            lendingMarket, // lendingMarket
            lendingMarketAuthority, // lendingMarketAuthority
            obligationOwner,//obligationOwner
            solendProgramAddress,//solend program address
            hostFeeReceiver
          )
    
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.BorrowObligationLiquidity,
                borrowAmount: new BN(borrowAmountNumber),
            },
            data
        );
        expect(dataLayout.decode(anotherTxnIxs.data).borrowAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(anotherTxnIxs.data).borrowAmount.toNumber()).toEqual(borrowAmountNumber);
    });

      });



import {PublicKey ,TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import { depositReserveLiquidityInstruction} from "../../src/instructions";
import { LendingInstruction } from "../../src/instructions/instruction";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../../src/utils/layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
jest.setTimeout(50_000);

describe("deposit reserve liquidity instruction", function () {

    const depositAmount = new BN(120_340_560_789);
    const destinationCollateral = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const sourceLiquidity = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const reserve = new PublicKey("64oqP1dFqqD8NEL4RPCpMyrHmpo31rj3nYxULVXvayfW");
    const reserveLiquiditySupply = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const solendProgramAddress = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const reserveCollateralMint = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const userTokenAccountAddress= new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const obligation = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
    const transferAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");
    const lendingMarket = new PublicKey("76pWmCRuVqHKsPSUph5X7xQ6bZho3apXXEdSNvr11Yvx");
    const lendingMarketAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");


      let txnIxs=  depositReserveLiquidityInstruction(
        depositAmount ,//amount
        userTokenAccountAddress,//userTokenAccountAddress
        destinationCollateral,//user collateral account address
        reserve,//reserve address
        reserveLiquiditySupply,//reserve liquid supply
        reserveCollateralMint,// collateral mint address
        lendingMarket,//lending market address
        lendingMarketAuthority,
        transferAuthority, // transferAuthority
        solendProgramAddress
      )
  
      const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        Layout.uint64("depositAmount"),
    ]);

      it("should create a valid deposit reserve liquidity instruction", () => {
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
        expect(txnIxs.keys).toHaveLength(9);
        expect(txnIxs.keys).toContainEqual(  { pubkey: sourceLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(  { pubkey: destinationCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserve, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserveCollateralMint, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarket, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual( { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual(    { pubkey: transferAuthority, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });
  
    it("returned instruction should have correct data", () => {
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositReserveLiquidity,
                depositAmount: new BN(depositAmount),
            },
            data
        );
        expect(txnIxs.data).toBeInstanceOf(Uint8Array);
        expect(txnIxs.data).toEqual(data);
        expect(dataLayout.decode(txnIxs.data).instruction).toBe(LendingInstruction.DepositReserveLiquidity);
        expect(dataLayout.decode(txnIxs.data).depositAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(txnIxs.data).depositAmount.toNumber()).toEqual(depositAmount.toNumber());
    });

    it("should work with Number as well as BN", () => {
        const depositAmountNumber = 1234; // Number instead of BN
        const anotherTxnIxs = depositReserveLiquidityInstruction(
            depositAmountNumber ,//amount
            userTokenAccountAddress,//userTokenAccountAddress
            destinationCollateral,//user collateral account address
            reserve,//reserve address
            reserveLiquiditySupply,//reserve liquid supply
            reserveCollateralMint,// collateral mint address
            lendingMarket,//lending market address
            lendingMarketAuthority,
            transferAuthority, // transferAuthority
            solendProgramAddress
          )
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositReserveLiquidity,
                depositAmount: new BN(depositAmountNumber),
            },
            data
        );
        expect(dataLayout.decode(anotherTxnIxs.data).depositAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(anotherTxnIxs.data).depositAmount.toNumber()).toEqual(depositAmountNumber);

      });

      });



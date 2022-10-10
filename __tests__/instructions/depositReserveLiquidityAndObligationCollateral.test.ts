import { PublicKey ,TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import { depositReserveLiquidityAndObligationCollateralInstruction} from "../../src/instructions";
import { LendingInstruction } from "../../src/instructions/instruction";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../../src/utils/layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
jest.setTimeout(50_000);


describe("deposit reserve liquidity and obligation collateral instruction", function () {
    const depositAmount = new BN(120_340_560_789);
    const userTokenAccountAddress = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const reserve = new PublicKey("64oqP1dFqqD8NEL4RPCpMyrHmpo31rj3nYxULVXvayfW");
    const reserveLiquiditySupply = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const  reserveCollateralMint= new PublicKey("Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR");
    const obligation = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
    const lendingMarketAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");
    const lendingMarket = new PublicKey("76pWmCRuVqHKsPSUph5X7xQ6bZho3apXXEdSNvr11Yvx");
    const solendProgramAddress = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const transferAuthority = new PublicKey("6hWf9DXxUu9cjSw63mnyrkrpXinxiQ1BogFRPskpoNNh");

    const destinationCollateral = new PublicKey("HJLTaDvwcyHvLbvme81E2BtyxsURfazo34anUwTZDc3W");
    const obligationOwner = new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo");
    const pythOracle = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const switchboardFeedAddress = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const sourceLiquidity = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");
    const sourceCollateral = new PublicKey("AzqYUWKG5kqXgNwCvnuKdF8nRNBsJvbLK6NpTzWJtxHr");

    let txnIxs=      depositReserveLiquidityAndObligationCollateralInstruction(
        depositAmount,
        userTokenAccountAddress ,//usertoken acount address
        sourceCollateral,//source collateral
        reserve,//reserve address
        reserveLiquiditySupply,//reserve liquidity address
        reserveCollateralMint,//reserve collateral mint address
        lendingMarket,//lending market address
        lendingMarketAuthority, // lendingMarketAuthority
        destinationCollateral , // destinationCollateral
        obligation, // obligation 
        obligationOwner, // obligationOwner
        pythOracle,// reserve pythOracle
        switchboardFeedAddress,// reserve switch board oracle
        transferAuthority, // transferAuthority
        solendProgramAddress
      )
      console.log(txnIxs,txnIxs.keys )

      const dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        Layout.uint64("depositAmount"),
    ]);

      it("should create a valid deposit reserve liquidity and obligation collateral instruction", () => {
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
        expect(txnIxs.keys).toHaveLength(14);
        expect(txnIxs.keys).toContainEqual(  { pubkey: sourceLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(  { pubkey: sourceCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserve, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: reserveCollateralMint, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual({ pubkey: lendingMarket, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual( { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual(  { pubkey: destinationCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(   { pubkey: sourceLiquidity, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(  { pubkey: sourceCollateral, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(     { pubkey: obligation, isSigner: false, isWritable: true });
        expect(txnIxs.keys).toContainEqual(    { pubkey: obligationOwner, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual(     { pubkey: pythOracle, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual(    { pubkey: switchboardFeedAddress, isSigner: false, isWritable: false });
        expect(txnIxs.keys).toContainEqual(    { pubkey: transferAuthority, isSigner: true, isWritable: false });
        expect(txnIxs.keys).toContainEqual({ pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false });
    });


    it("returned instruction should have correct data", () => {
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositReserveLiquidityAndObligationCollateral,
                depositAmount: new BN(depositAmount),
            },
            data
        );
        expect(txnIxs.data).toBeInstanceOf(Uint8Array);
        expect(txnIxs.data).toEqual(data);
        expect(dataLayout.decode(txnIxs.data).instruction).toBe(LendingInstruction.DepositReserveLiquidityAndObligationCollateral);
        expect(dataLayout.decode(txnIxs.data).depositAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(txnIxs.data).depositAmount.toNumber()).toEqual(depositAmount.toNumber());
    });

    it("should work with Number as well as BN", () => {
        const depositAmountNumber = 1234; // Number instead of BN
        const anotherTxnIxs =   depositReserveLiquidityAndObligationCollateralInstruction(
            depositAmountNumber,
            userTokenAccountAddress ,//usertoken acount address
            sourceCollateral,//source collateral
            reserve,//reserve address
            reserveLiquiditySupply,//reserve liquidity address
            reserveCollateralMint,//reserve collateral mint address
            lendingMarket,//lending market address
            lendingMarketAuthority, // lendingMarketAuthority
            destinationCollateral , // destinationCollateral
            obligation, // obligation 
            obligationOwner, // obligationOwner
            pythOracle,// reserve pythOracle
            switchboardFeedAddress,// reserve switch board oracle
            transferAuthority, // transferAuthority
            solendProgramAddress
          )
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
                instruction: LendingInstruction.DepositReserveLiquidityAndObligationCollateral,
                depositAmount: new BN(depositAmountNumber),
            },
            data
        );
        expect(dataLayout.decode(anotherTxnIxs.data).depositAmount).toBeInstanceOf(BN);
        expect(dataLayout.decode(anotherTxnIxs.data).depositAmount.toNumber()).toEqual(depositAmountNumber);

      });

      });



const { expectRevert } = require("openzeppelin-test-helpers");
const ERC20Base = artifacts.require("ERC20Base");
const StockCDP = artifacts.require("StockCDP");
const MockBridge = artifacts.require("MockBridge");

require("chai").should();

contract("StockCDP", ([_, owner, alice, bob]) => {
  context("StockCDP should work correctly", () => {
    beforeEach(async () => {
      this.dollar = await ERC20Base.new("Dollar", "USD", { from: owner });
      this.bridge = await MockBridge.new({ from: owner });
      this.scdp = await StockCDP.new(
        this.bridge.address,
        this.dollar.address,
        12,
        "^GSPC",
        100,
        { from: owner },
      );
    });

    context("Basics", () => {
      it("should get the correct config", async () => {
        const config = await this.scdp.config();
        [config[0], config[1], config[2], config[3], config[4]]
          .toString()
          .should.eq(
            [
              this.bridge.address,
              this.dollar.address,
              12,
              "^GSPC",
              100,
            ].toString(),
          );
      });

      it("should be able to set price for mock bridge", async () => {
        (await this.bridge.encodedPrice())
          .toString()
          .should.eq("8813000000000000");

        await this.bridge.setPriceToBe100();

        (await this.bridge.encodedPrice())
          .toString()
          .should.eq("1027000000000000");

        await this.bridge.setPriceToBe50();

        (await this.bridge.encodedPrice())
          .toString()
          .should.eq("8813000000000000");
      });
    });

    context("CDP", () => {
      beforeEach(async () => {
        await this.dollar.mint(alice, 1000000, { from: owner });
        await this.dollar.mint(bob, 1000000, { from: owner });

        await this.dollar.approve(this.scdp.address, "1000000", {
          from: alice,
        });
        await this.dollar.approve(this.scdp.address, "1", {
          from: bob,
        });
      });

      it("should get correct balance and allowance of alice and bob", async () => {
        (await this.dollar.balanceOf(alice)).toString().should.eq("1000000");
        (await this.dollar.allowance(alice, this.scdp.address))
          .toString()
          .should.eq("1000000");

        (await this.dollar.balanceOf(bob)).toString().should.eq("1000000");
        (await this.dollar.allowance(bob, this.scdp.address))
          .toString()
          .should.eq("1");
      });

      it("should be able to lock balance", async () => {
        await this.scdp.lockCollateral("10000", { from: alice });

        (await this.dollar.balanceOf(alice))
          .toString()
          .should.eq((1000000 - 10000).toString());

        (await this.dollar.balanceOf(this.scdp.address))
          .toString()
          .should.eq("10000");
      });

      it("should not be able to lock balance if not enough allowance", async () => {
        await expectRevert(
          this.scdp.lockCollateral("100", { from: bob }),
          "ERC20: transfer amount exceeds allowance.",
        );

        (await this.dollar.balanceOf(bob)).toString().should.eq("1000000");

        (await this.dollar.balanceOf(this.scdp.address))
          .toString()
          .should.eq("0");
      });

      context("Alice interact with CDP", () => {
        beforeEach(async () => {
          await this.scdp.lockCollateral("10000", { from: alice });
        });

        it("should be able to unlock balance", async () => {
          (await this.dollar.balanceOf(alice))
            .toString()
            .should.eq((1000000 - 10000).toString());

          (await this.dollar.balanceOf(this.scdp.address))
            .toString()
            .should.eq("10000");

          await this.scdp.unlockCollateral(
            "10000",
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.dollar.balanceOf(alice)).toString().should.eq("1000000");

          (await this.dollar.balanceOf(this.scdp.address))
            .toString()
            .should.eq("0");
        });

        it("should be able to borrow as long as value of callateral >= 1.5*debt", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          await this.scdp.borrowDebt(
            "33", // borrow more 33 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("133");

          // 133*50 = 6650 which is 66.5% of 10,000
          // The value of callateral is now equal to the value of 1.5*debt
          // Should not be able to borrow anymore
          await expectRevert(
            this.scdp.borrowDebt(
              "1", // borrow more 1 SPX
              "0x00", // Mock proof can be any bytes
              { from: alice },
            ),
            "FAIL_TO_BORROW_EXCEED_COLLATERAL_VALUE",
          );
        });

        it("should be able to borrow and return debt", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          await this.scdp.returnDebt(
            "50", // return 50 SPX
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("50");

          await this.scdp.borrowDebt(
            "25", // borrow 25 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("75");

          await this.scdp.returnDebt(
            "75", // return 75 SPX
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("0");
        });

        it("should not be able to return more than the amount borrowed", async () => {
          // Alice cannot return debt because she haven't borrowed anything at all
          await expectRevert(
            this.scdp.returnDebt(
              "1", // return 1 SPX
              { from: alice },
            ),
            "ERC20: burn amount exceeds balance.",
          );

          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          // Alice cannot return more than the amount borrowed
          await expectRevert(
            this.scdp.returnDebt(
              "200", // return 200 SPX
              { from: alice },
            ),
            "ERC20: burn amount exceeds balance.",
          );
        });

        it("should be able to transfer SPX freely after borrowing", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          await this.scdp.transfer(bob, 40, { from: alice });

          (await this.scdp.balanceOf(bob)).toString().should.eq("40");
          (await this.scdp.balanceOf(alice)).toString().should.eq("60");

          await this.scdp.transfer(bob, 60, { from: alice });

          (await this.scdp.balanceOf(bob)).toString().should.eq("100");
          (await this.scdp.balanceOf(alice)).toString().should.eq("0");

          await this.scdp.transfer(alice, 100, { from: bob });

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");
        });

        it("should not be able return debt if you don't have it anymore", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          // Alice --- 100 SPX ---> Bob
          await this.scdp.transfer(bob, 100, { from: alice });

          (await this.scdp.balanceOf(bob)).toString().should.eq("100");
          (await this.scdp.balanceOf(alice)).toString().should.eq("0");

          // Now Alice has 0 SPX because she has sent all the SPX to Bob
          await expectRevert(
            this.scdp.returnDebt(
              "100", // try to return 100 SPX
              { from: alice },
            ),
            "ERC20: burn amount exceeds balance.",
          );

          // Alice <--- 100 SPX --- Bob
          await this.scdp.transfer(alice, 100, { from: bob });

          await this.scdp.returnDebt(
            "100", // return 100 SPX
            { from: alice },
          );

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("0");
        });

        it("should be able to liquidate Alice of her collateral doesn't meet the conditions", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.dollar.balanceOf(bob)).toString().should.eq("1000000");
          (await this.dollar.balanceOf(alice))
            .toString()
            .should.eq((1000000 - 10000).toString());

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          // Alice --- 100 SPX ---> Bob
          await this.scdp.transfer(bob, 100, { from: alice });

          (await this.scdp.balanceOf(bob)).toString().should.eq("100");
          (await this.scdp.balanceOf(alice)).toString().should.eq("0");

          // Bob can not liquidate Alice right now
          await expectRevert(
            this.scdp.liquidate(alice, "0x00", { from: bob }),
            "FAIL_TO_LIQUIDATE_COLLATERAL_RATIO_IS_OK",
          );

          // Owner bullied Alice by sending tx to increase the price unexpectedly
          // 1.5 * 100 * 100 (debt * price) = 15000 which is more than 10000 (Alice's collateral)
          await this.bridge.setPriceToBe100({ from: owner });

          // Bob try to liquidate again
          // Bob should be able to do it now
          await this.scdp.liquidate(alice, "0x00", { from: bob });

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("0");

          (await this.dollar.balanceOf(bob))
            .toString()
            .should.eq((1000000 + 10000).toString());
          (await this.dollar.balanceOf(alice))
            .toString()
            .should.eq((1000000 - 10000).toString());
        });

        it("should not be able to liquidate if the liquidator doesn't have enough SPX", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          // Owner bullied Alice by sending tx to increase the price unexpectedly
          // 1.5 * 100 * 100 (debt * price) = 15000 which is more than 10000 (Alice's collateral)
          await this.bridge.setPriceToBe100({ from: owner });

          // Bob can not liquidate Alice right now because he got 0 SPX
          await expectRevert(
            this.scdp.liquidate(alice, "0x00", { from: bob }),
            "ERC20: burn amount exceeds balance.",
          );

          // The owner cheated the system by casting SPX for Bob.
          await this.scdp.mint(bob, 50, { from: owner });

          // Bob can not liquidate Alice right now because he got 50 SPX
          // Bob need more SPX (SPX >= 100)
          await expectRevert(
            this.scdp.liquidate(alice, "0x00", { from: bob }),
            "ERC20: burn amount exceeds balance.",
          );

          // The owner cheated the system by casting SPX for Bob.
          await this.scdp.mint(bob, 5000, { from: owner });

          // Bob can now liquidate Alice's CDP
          await this.scdp.liquidate(alice, "0x00", { from: bob });

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");
          (await this.scdp.balanceOf(bob))
            .toString()
            .should.eq((50 + 5000 - 100).toString());

          (await this.dollar.balanceOf(bob))
            .toString()
            .should.eq((1000000 + 10000).toString());
          (await this.dollar.balanceOf(alice))
            .toString()
            .should.eq((1000000 - 10000).toString());
        });

        it("should not be able return debt after the CDP has been liquidate", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(bob)).toString().should.eq("0");
          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          // Owner bullied Alice by sending tx to increase the price unexpectedly
          // 1.5 * 100 * 100 (debt * price) = 15000 which is more than 10000 (Alice's collateral)
          await this.bridge.setPriceToBe100({ from: owner });

          // The owner cheated the system by casting SPX for Bob.
          await this.scdp.mint(bob, 100, { from: owner });

          // Bob can now liquidate Alice's CDP
          await this.scdp.liquidate(alice, "0x00", { from: bob });

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");
          (await this.scdp.balanceOf(bob)).toString().should.eq("0");

          (await this.dollar.balanceOf(bob))
            .toString()
            .should.eq((1000000 + 10000).toString());
          (await this.dollar.balanceOf(alice))
            .toString()
            .should.eq((1000000 - 10000).toString());

          // Alice can no longer return the debt because it has been liquidate
          await expectRevert(
            this.scdp.returnDebt(
              "100", // return 100 SPX
              { from: alice },
            ),
            "SafeMath: subtraction overflow.",
          );
        });
      });
    });
  });
});

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
          .should.eq("3200000000000000");

        await this.bridge.setPriceToBe100();

        (await this.bridge.encodedPrice())
          .toString()
          .should.eq("6400000000000000");

        await this.bridge.setPriceToBe50();

        (await this.bridge.encodedPrice())
          .toString()
          .should.eq("3200000000000000");
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

        it("should be able to borrow if value of callateral >= 1.5*debt", async () => {
          await this.scdp.borrowDebt(
            "100", // borrow 100 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("100");

          await this.scdp.borrowDebt(
            "20", // borrow more 20 SPX
            "0x00", // Mock proof can be any bytes
            { from: alice },
          );

          (await this.scdp.balanceOf(alice)).toString().should.eq("120");
        });
      });
    });
  });
});

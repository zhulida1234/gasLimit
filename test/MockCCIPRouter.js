const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockRouter", function () {

    let chainSelector = "16015286601757825753";
    let owner;
    let router;
    let sender;
    let receiver;
    let BurnMintERC677;
    let link;

    beforeEach(async function () {

        owner = (await ethers.getSigners())[0];
        const Router = await ethers.getContractFactory("MockCCIPRouter");
        const Sender = await ethers.getContractFactory("Sender");
        const Receiver = await ethers.getContractFactory("Receiver");
        BurnMintERC677 = await ethers.getContractFactory("BurnMintERC677");

        router = await Router.deploy();
        await router.waitForDeployment();
        console.info("router address",router.target);

        link = await BurnMintERC677.deploy(
            "ChainLink Token",
            "LINK",
            18,
            BigInt(1e27)
        );
        await link.waitForDeployment();
        console.info("link address",link.target);

        sender = await Sender.deploy(router.target, link.target);
        await sender.waitForDeployment();
        console.info("sender address",sender.target);

        receiver = await Receiver.deploy(router.target);
        await receiver.waitForDeployment();
        console.info("receiver address"),receiver.target;

        await sender.allowlistDestinationChain(chainSelector, true);
        await receiver.allowlistSourceChain(chainSelector, true);
        await receiver.allowlistSender(sender.target, true);

    });


    it("should CCIP message from sender to receiver ", async function () {
        // Define parameters for the tests, including gas limit and iterations for messages.
        const gasLimit = 400000;
        const testParams = [0, 50, 99]; // Different iteration values for testing.
        const gasUsageReport = []; // To store reports of gas used for each test.

        for (const iterations of testParams) {
            await sender.sendMessagePayLINK(
              chainSelector,
              receiver.target,
              iterations,
              gasLimit
            );
            // Retrieve gas used from the last message executed by querying the router's events.
            const mockRouterEvents = await router.queryFilter(
                router.filters.MsgExecuted()
            );
            const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
            const gasUsed = mockRouterEvent.args.gasUsed;

            // Push the report of iterations and gas used to the array.
            gasUsageReport.push({
                iterations,
                gasUsed: gasUsed.toString(),
            });
        }

        // Log the final report of gas usage for each iteration.
        console.log("Final Gas Usage Report:");
        gasUsageReport.forEach((report) => {
            console.log(
            "Number of iterations %d - Gas used: %d",
            report.iterations,
            report.gasUsed
        );
        });

        
        const USDC = await ethers.getContractFactory("ERC20");
        const usdc = await USDC.deploy("USDC","USDC");
        await usdc.waitForDeployment();
        console.info("usdc.target",usdc.target);
        
        const TransferUSDC = await ethers.getContractFactory("TransferUSDC");

        const transferUSDC = await TransferUSDC.deploy(router.target,link.target,usdc.target);
        await transferUSDC.waitForDeployment();
        console.info("transferUSDC.target",transferUSDC.target);

        //  需要执行mint，approve，transferUSDC等方法
    });
});

module.exports = {
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};

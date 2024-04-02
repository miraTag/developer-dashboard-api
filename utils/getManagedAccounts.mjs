const getManagedAccounts = (managedAccounts) =>
  managedAccounts?.map((acc) => {
    return {
      ...acc,
      siteKeys: acc.siteKeys.map((key) => {
        let keyArr = key.split("|");
        return {
          siteKey: keyArr[0],
          awsRegion: keyArr[1] === "eu" ? "eu-west-1" : "us-east-2",
        };
      }),
    };
  });

export default getManagedAccounts;

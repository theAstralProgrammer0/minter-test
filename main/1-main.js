import dbClient from '../utils/db';

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject("REJECT: Something went wrong")
                }
                else if(!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve("RESOLVE: Road clear!")
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
  try {
    console.log(dbClient.isAlive());
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
  }
  catch(err) {
    console.error("Driver Function Error: ", err);
  }
})();

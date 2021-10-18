import dotenv from "dotenv";

class SingleRun {
  private envConfig = () => {
    if (process.env.RUNNINGON == "production") {
      dotenv.config({
        path: `${process.cwd()}/src/utils/envFiles/.production.env`,
      });
    } else {
      dotenv.config({
        path: `${process.cwd()}/src/utils/envFiles/.local.env`,
      });
    }
  };

  public static async runAllMethods() {
    const singleRun = new SingleRun();

    singleRun.envConfig();
  }
}

export default SingleRun.runAllMethods;

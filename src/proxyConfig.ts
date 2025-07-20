export class ProxyConfig {
  private static instance: ProxyConfig | null = null;

  //***Edit this branch list to allow pushes***
  branchesAllowPush: string[] = ["main", "develop", "master"];

  private constructor() {}

  public static getInstance() {
    if (!ProxyConfig.instance) {
      ProxyConfig.instance = new ProxyConfig();
    }
    return ProxyConfig.instance;
  }
  public addBranches(branches: string[]) {
    this.branchesAllowPush = this.branchesAllowPush.concat(branches);
  }
}

export interface WebhookBitbucketOnPremisePR {
  eventKey: string;
  date: string;
  actor: User;
  pullRequest: PullRequest;
}

interface Link {
  href: string;
}

interface SelfLink extends Link {}

interface CloneLink extends Link {
  name: string;
}

interface User {
  name: string;
  emailAddress: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
  type: string;
  links: {
    self: SelfLink[];
  };
}

interface Repository {
  slug: string;
  id: number;
  name: string;
  description: string;
  scmId: string;
  state: string;
  statusMessage: string;
  forkable: boolean;
  project: {
    key: string;
    id: number;
    name: string;
    description: string;
    public: boolean;
    type: string;
    links: {
      self: SelfLink[];
    };
  };
  public: boolean;
  links: {
    clone: CloneLink[];
    self: SelfLink[];
  };
}

interface Ref {
  id: string;
  displayId: string;
  latestCommit: string;
  repository: Repository;
}

interface PullRequestAuthor {
  user: User;
  role: string;
  approved: boolean;
  status: string;
}

interface PullRequest {
  id: number;
  version: number;
  title: string;
  description: string;
  state: string;
  open: boolean;
  closed: boolean;
  createdDate: number;
  updatedDate: number;
  fromRef: Ref;
  toRef: Ref;
  locked: boolean;
  author: PullRequestAuthor;
  reviewers: PullRequestAuthor[];
  participants: any[]; // Adjust type if participants have a specific structure
  links: {
    self: SelfLink[];
  };
}

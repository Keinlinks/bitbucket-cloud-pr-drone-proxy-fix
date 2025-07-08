export interface WebhookBitbucketCloudPush {
  push: {
    changes: Change[];
  };
  repository: Repository;
  actor: Actor;
}

export interface Link {
  href: string;
}

export interface Links {
  self?: Link;
  avatar?: Link;
  html?: Link;
  commits?: Link;
  pullrequest_create?: Link;
  diff?: Link;
  approve?: Link;
  comments?: Link;
  statuses?: Link;
  patch?: Link;
}

export interface User {
  display_name: string;
  links: Links;
  type: "user";
  uuid: string;
  account_id: string;
  nickname: string;
}

export interface Author {
  type: "author";
  raw: string;
  user: User;
}

export interface Summary {
  type: "rendered";
  raw: string;
  markup: "markdown";
  html: string;
}

export interface Commit {
  type: "commit";
  hash: string;
  date: string;
  author: Author;
  committer: Record<string, never>;
  message: string;
  summary: Summary;
  links: Links;
  parents: Array<{
    hash: string;
    links: Links;
    type: "commit";
  }>;
  rendered: Record<string, never>;
  properties: Record<string, never>;
}

export interface Branch {
  name: string;
  target: Commit;
  links: Links;
  type: string;
  merge_strategies: string[];
  sync_strategies: string[];
  default_merge_strategy: string;
}

export interface Change {
  old: Branch;
  new: Branch;
  truncated: boolean;
  created: boolean;
  forced: boolean;
  closed: boolean;
  links: Links;
  commits: Commit[];
}

export interface Repository {
  type: "repository";
  full_name: string;
  links: Links;
  name: string;
  scm: "git";
  website: null;
  owner: {
    display_name: string;
    links: Links;
    type: "team";
    uuid: string;
    username: string;
  };
  workspace: {
    type: "workspace";
    uuid: string;
    name: string;
    slug: string;
    links: Links;
  };
  is_private: boolean;
  project: {
    type: "project";
    key: string;
    uuid: string;
    name: string;
    links: Links;
  };
  uuid: string;
  parent: null;
}

export interface Actor {
  display_name: string;
  links: Links;
  type: "user";
  uuid: string;
  account_id: string;
  nickname: string;
}

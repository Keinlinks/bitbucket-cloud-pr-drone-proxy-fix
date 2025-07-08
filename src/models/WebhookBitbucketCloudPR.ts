export interface WebhookBitbucketCloudPR {
  repository: Repository;
  actor: User;
  pullrequest: PullRequest;
}

interface Link {
  href: string;
}

interface Links {
  self?: Link;
  html?: Link;
  avatar?: Link;
  commits?: Link;
  approve?: Link;
  "request-changes"?: Link;
  diff?: Link;
  diffstat?: Link;
  comments?: Link;
  activity?: Link;
  merge?: Link;
  decline?: Link;
  statuses?: Link;
}

interface Owner {
  display_name: string;
  links: Links;
  type: string;
  uuid: string;
  username: string;
}

interface Workspace {
  type: string;
  uuid: string;
  name: string;
  slug: string;
  links: Links;
}

interface Project {
  type: string;
  key: string;
  uuid: string;
  name: string;
  links: Links;
}

interface Repository {
  type: string;
  full_name: string;
  links: Links;
  name: string;
  scm: string;
  website: string | null;
  owner: Owner;
  workspace: Workspace;
  is_private: boolean;
  project: Project;
  uuid: string;
  parent: string | null;
}

interface User {
  display_name: string;
  links: Links;
  type: string;
  uuid: string;
  account_id: string;
  nickname: string;
}

interface RenderedContent {
  type: string;
  raw: string;
  markup: string;
  html: string;
}

interface Branch {
  name: string;
  links?: Record<string, never>;
  sync_strategies?: string[];
}

interface Commit {
  hash: string;
  links: Links;
  type: string;
}

interface SourceDestination {
  branch: Branch;
  commit: Commit;
  repository: {
    type: string;
    full_name: string;
    links: Links;
    name: string;
    uuid: string;
  };
}

interface Participant {
  type: string;
  user: User;
  role: string;
  approved: boolean;
  state: string | null;
  participated_on: string | null;
}

interface PullRequest {
  comment_count: number;
  task_count: number;
  type: string;
  id: number;
  title: string;
  description: string;
  rendered: {
    title: RenderedContent;
    description: RenderedContent;
  };
  state: string;
  draft: boolean;
  merge_commit: string | null;
  close_source_branch: boolean;
  closed_by: string | null;
  author: User;
  reason: string;
  created_on: string;
  updated_on: string;
  destination: SourceDestination;
  source: SourceDestination;
  reviewers: User[];
  participants: Participant[];
  links: Links;
  summary: RenderedContent;
}

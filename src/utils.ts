import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import {
  Change,
  Commit,
  WebhookBitbucketCloudPush,
} from "./models/WebhookBitbucketCloudPush";

// export function transformBitbucketWebhookPRToOnPremisePR(
//   input: WebhookBitbucketCloudPR
// ): WebhookBitbucketOnPremisePR {
//   const repoSlug =
//     input.repository.full_name.split("/")[1] || input.repository.name;

//   const createdDate = new Date(input.pullrequest.created_on).getTime();
//   const updatedDate = new Date(input.pullrequest.updated_on).getTime();

//   return {
//     eventKey: "pr:opened",
//     date: input.pullrequest.created_on,
//     actor: {
//       name: input.actor.nickname || input.actor.display_name,
//       emailAddress: "",
//       id: parseInt(input.actor.account_id, 16) || 0,
//       displayName: input.actor.display_name,
//       active: true,
//       slug:
//         input.actor.nickname ||
//         input.actor.display_name.toLowerCase().replace(/\s+/g, "-"),
//       type: input.actor.type,
//       links: {
//         self: input.actor.links.self
//           ? [{ href: input.actor.links.self.href }]
//           : [],
//       },
//     },
//     pullRequest: {
//       id: input.pullrequest.id,
//       version: 1,
//       title: input.pullrequest.title,
//       description: input.pullrequest.description || "",
//       state: input.pullrequest.state,
//       open: input.pullrequest.state === "OPEN",
//       closed:
//         input.pullrequest.state === "MERGED" ||
//         input.pullrequest.state === "DECLINED",
//       createdDate,
//       updatedDate,
//       fromRef: {
//         id: `refs/heads/${input.pullrequest.source.branch.name}`,
//         displayId: input.pullrequest.source.branch.name,
//         latestCommit: input.pullrequest.source.commit.hash,
//         repository: {
//           slug: input.pullrequest.source.repository.name,
//           id:
//             parseInt(
//               input.pullrequest.source.repository.uuid.replace(/[{}]/g, ""),
//               16
//             ) || 0,
//           name: input.pullrequest.source.repository.name,
//           description: "",
//           scmId: input.pullrequest.source.repository.type,
//           state: "AVAILABLE",
//           statusMessage: "Available",
//           forkable: true,
//           project: {
//             key: input.repository.project.key,
//             id:
//               parseInt(
//                 input.repository.project.uuid.replace(/[{}]/g, ""),
//                 16
//               ) || 0,
//             name: input.repository.project.name,
//             description: "",
//             public: !input.repository.is_private,
//             type: input.repository.project.type,
//             links: {
//               self: input.repository.project.links.self
//                 ? [{ href: input.repository.project.links.self.href }]
//                 : [],
//             },
//           },
//           public: !input.repository.is_private,
//           links: {
//             clone: [],
//             self: input.pullrequest.source.repository.links.self
//               ? [{ href: input.pullrequest.source.repository.links.self.href }]
//               : [],
//           },
//         },
//       },
//       toRef: {
//         id: `refs/heads/${input.pullrequest.destination.branch.name}`,
//         displayId: input.pullrequest.destination.branch.name,
//         latestCommit: input.pullrequest.destination.commit.hash,
//         repository: {
//           slug: input.pullrequest.destination.repository.name,
//           id:
//             parseInt(
//               input.pullrequest.destination.repository.uuid.replace(
//                 /[{}]/g,
//                 ""
//               ),
//               16
//             ) || 0,
//           name: input.pullrequest.destination.repository.name,
//           description: "",
//           scmId: input.pullrequest.destination.repository.type,
//           state: "AVAILABLE",
//           statusMessage: "Available",
//           forkable: true,
//           project: {
//             key: input.repository.project.key,
//             id:
//               parseInt(
//                 input.repository.project.uuid.replace(/[{}]/g, ""),
//                 16
//               ) || 0,
//             name: input.repository.project.name,
//             description: "",
//             public: !input.repository.is_private,
//             type: input.repository.project.type,
//             links: {
//               self: input.repository.project.links.self
//                 ? [{ href: input.repository.project.links.self.href }]
//                 : [],
//             },
//           },
//           public: !input.repository.is_private,
//           links: {
//             clone: [],
//             self: input.pullrequest.destination.repository.links.self
//               ? [
//                   {
//                     href: input.pullrequest.destination.repository.links.self
//                       .href,
//                   },
//                 ]
//               : [],
//           },
//         },
//       },
//       locked: false,
//       author: {
//         user: {
//           name:
//             input.pullrequest.author.nickname ||
//             input.pullrequest.author.display_name,
//           emailAddress: "",
//           id: parseInt(input.pullrequest.author.account_id, 16) || 0,
//           displayName: input.pullrequest.author.display_name,
//           active: true,
//           slug:
//             input.pullrequest.author.nickname ||
//             input.pullrequest.author.display_name
//               .toLowerCase()
//               .replace(/\s+/g, "-"),
//           type: input.pullrequest.author.type,
//           links: {
//             self: input.pullrequest.author.links.self
//               ? [{ href: input.pullrequest.author.links.self.href }]
//               : [],
//           },
//         },
//         role: "AUTHOR",
//         approved: false,
//         status: input.pullrequest.state,
//       },
//       reviewers: input.pullrequest.reviewers.map((reviewer) => ({
//         user: {
//           name: reviewer.nickname || reviewer.display_name,
//           emailAddress: "",
//           id: parseInt(reviewer.account_id, 16) || 0,
//           displayName: reviewer.display_name,
//           active: true,
//           slug:
//             reviewer.nickname ||
//             reviewer.display_name.toLowerCase().replace(/\s+/g, "-"),
//           type: reviewer.type,
//           links: {
//             self: reviewer.links.self
//               ? [{ href: reviewer.links.self.href }]
//               : [],
//           },
//         },
//         role: "REVIEWER",
//         approved: false,
//         status: "",
//       })),
//       participants: input.pullrequest.participants,
//       links: {
//         self: input.pullrequest.links.self
//           ? [{ href: input.pullrequest.links.self.href }]
//           : [],
//       },
//     },
//   };
// }

// export function parseWebhookBitbucketCloudPRtoPush(
//   pr: WebhookBitbucketCloudPR
// ): WebhookBitbucketCloudPush {
//   const commit: Commit = {
//     type: "commit",
//     hash: pr.pullrequest.source.commit.hash,
//     date: pr.pullrequest.updated_on,
//     author: {
//       type: "author",
//       raw: `${pr.actor.display_name} <${pr.actor.account_id}@example.com>`,
//       user: pr.actor,
//     },
//     committer: {},
//     message: pr.pullrequest.title,
//     summary: {
//       type: "rendered",
//       raw: pr.pullrequest.summary.raw,
//       markup: "markdown",
//       html: pr.pullrequest.summary.html,
//     },
//     links: pr.pullrequest.source.commit.links,
//     parents: [
//       {
//         hash: pr.pullrequest.destination.commit.hash,
//         links: pr.pullrequest.destination.commit.links,
//         type: "commit",
//       },
//     ],
//     rendered: {},
//     properties: {},
//   };

//   const branch: Branch = {
//     name: pr.pullrequest.source.branch.name,
//     target: commit,
//     links: {
//       self: pr.pullrequest.source.repository.links.self,
//       commits: {
//         href: `${pr.pullrequest.source.repository.links.commits?.href}/${pr.pullrequest.source.branch.name}`,
//       },
//       html: {
//         href: `${pr.pullrequest.source.repository.links.html?.href}/branch/${pr.pullrequest.source.branch.name}`,
//       },
//       pullrequest_create: {
//         href: `${pr.pullrequest.source.repository.links.html?.href}/pull-requests/new?source=${pr.pullrequest.source.branch.name}&t=1`,
//       },
//     },
//     type: "branch",
//     merge_strategies: [
//       "merge_commit",
//       "squash",
//       "fast_forward",
//       "squash_fast_forward",
//       "rebase_fast_forward",
//       "rebase_merge",
//     ],
//     sync_strategies: ["merge_commit", "rebase"],
//     default_merge_strategy: "merge_commit",
//   };

//   const change: Change = {
//     old: {
//       ...branch,
//       name: pr.pullrequest.destination.branch.name,
//       target: {
//         ...commit,
//         hash: pr.pullrequest.destination.commit.hash,
//         links: pr.pullrequest.destination.commit.links,
//       },
//     },
//     new: branch,
//     truncated: false,
//     created: false,
//     forced: false,
//     closed: false,
//     links: {
//       commits: {
//         href: `${pr.pullrequest.source.repository.links.commits?.href}?include=${pr.pullrequest.source.commit.hash}&exclude=${pr.pullrequest.destination.commit.hash}`,
//       },
//       diff: {
//         href: `${pr.pullrequest.source.repository.links.html?.href}/diff/${pr.pullrequest.source.commit.hash}..${pr.pullrequest.destination.commit.hash}`,
//       },
//       html: {
//         href: `${pr.pullrequest.source.repository.links.html?.href}/branches/compare/${pr.pullrequest.source.commit.hash}..${pr.pullrequest.destination.commit.hash}`,
//       },
//     },
//     commits: [commit],
//   };

//   return {
//     push: {
//       changes: [change],
//     },
//     repository: pr.repository,
//     actor: pr.actor,
//   };
// }

export function transformPRtoPush(
  prPayload: WebhookBitbucketCloudPR
): WebhookBitbucketCloudPush {
  const { pullrequest, repository, actor } = prPayload;

  const commit: Commit = {
    type: "commit",
    hash: pullrequest.source.commit.hash,
    date: pullrequest.created_on,
    message: `Pull Request: ${pullrequest.title}`,
    author: {
      type: "author",
      raw: pullrequest.author.display_name,
      user: pullrequest.author,
    },
    committer: {},
    summary: {
      type: "rendered",
      raw: pullrequest.title,
      markup: "markdown",
      html: `<p>${pullrequest.title}</p>`,
    },
    links: pullrequest.source.commit.links,
    parents: [],
    rendered: {},
    properties: {},
  };

  const change: Change = {
    new: {
      name: `${pullrequest.source.branch.name}`,
      target: commit,
      links: pullrequest.source.commit.links,
      type: "branch",
      merge_strategies: [],
      sync_strategies: pullrequest.source.branch.sync_strategies || [],
      default_merge_strategy: "",
    },
    old: {
      name: `${pullrequest.source.branch.name}`,
      target: { ...commit, hash: "53d31cb65ad5471ac079c13235e7f13f03420285" },
      links: pullrequest.source.commit.links,
      type: "branch",
      merge_strategies: [],
      sync_strategies: [],
      default_merge_strategy: "",
    },
    truncated: false,
    created: false,
    forced: false,
    closed: false,
    links: {},
    commits: [commit],
  };

  const pushPayload: WebhookBitbucketCloudPush = {
    push: {
      changes: [change],
    },
    repository,
    actor,
  };

  return pushPayload;
}

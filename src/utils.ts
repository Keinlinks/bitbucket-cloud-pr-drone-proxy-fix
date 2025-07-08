import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import { WebhookBitbucketOnPremisePR } from "./models/WebhookBitbucketOnPremisePR";

export function transformBitbucketWebhookPRToOnPremisePR(
  input: WebhookBitbucketCloudPR
): WebhookBitbucketOnPremisePR {
  const repoSlug =
    input.repository.full_name.split("/")[1] || input.repository.name;

  const createdDate = new Date(input.pullrequest.created_on).getTime();
  const updatedDate = new Date(input.pullrequest.updated_on).getTime();

  return {
    eventKey: "pr:opened",
    date: input.pullrequest.created_on,
    actor: {
      name: input.actor.nickname || input.actor.display_name,
      emailAddress: "",
      id: parseInt(input.actor.account_id, 16) || 0,
      displayName: input.actor.display_name,
      active: true,
      slug:
        input.actor.nickname ||
        input.actor.display_name.toLowerCase().replace(/\s+/g, "-"),
      type: input.actor.type,
      links: {
        self: input.actor.links.self
          ? [{ href: input.actor.links.self.href }]
          : [],
      },
    },
    pullRequest: {
      id: input.pullrequest.id,
      version: 1,
      title: input.pullrequest.title,
      description: input.pullrequest.description || "",
      state: input.pullrequest.state,
      open: input.pullrequest.state === "OPEN",
      closed:
        input.pullrequest.state === "MERGED" ||
        input.pullrequest.state === "DECLINED",
      createdDate,
      updatedDate,
      fromRef: {
        id: `refs/heads/${input.pullrequest.source.branch.name}`,
        displayId: input.pullrequest.source.branch.name,
        latestCommit: input.pullrequest.source.commit.hash,
        repository: {
          slug: input.pullrequest.source.repository.name,
          id:
            parseInt(
              input.pullrequest.source.repository.uuid.replace(/[{}]/g, ""),
              16
            ) || 0,
          name: input.pullrequest.source.repository.name,
          description: "",
          scmId: input.pullrequest.source.repository.type,
          state: "AVAILABLE",
          statusMessage: "Available",
          forkable: true,
          project: {
            key: input.repository.project.key,
            id:
              parseInt(
                input.repository.project.uuid.replace(/[{}]/g, ""),
                16
              ) || 0,
            name: input.repository.project.name,
            description: "",
            public: !input.repository.is_private,
            type: input.repository.project.type,
            links: {
              self: input.repository.project.links.self
                ? [{ href: input.repository.project.links.self.href }]
                : [],
            },
          },
          public: !input.repository.is_private,
          links: {
            clone: [],
            self: input.pullrequest.source.repository.links.self
              ? [{ href: input.pullrequest.source.repository.links.self.href }]
              : [],
          },
        },
      },
      toRef: {
        id: `refs/heads/${input.pullrequest.destination.branch.name}`,
        displayId: input.pullrequest.destination.branch.name,
        latestCommit: input.pullrequest.destination.commit.hash,
        repository: {
          slug: input.pullrequest.destination.repository.name,
          id:
            parseInt(
              input.pullrequest.destination.repository.uuid.replace(
                /[{}]/g,
                ""
              ),
              16
            ) || 0,
          name: input.pullrequest.destination.repository.name,
          description: "",
          scmId: input.pullrequest.destination.repository.type,
          state: "AVAILABLE",
          statusMessage: "Available",
          forkable: true,
          project: {
            key: input.repository.project.key,
            id:
              parseInt(
                input.repository.project.uuid.replace(/[{}]/g, ""),
                16
              ) || 0,
            name: input.repository.project.name,
            description: "",
            public: !input.repository.is_private,
            type: input.repository.project.type,
            links: {
              self: input.repository.project.links.self
                ? [{ href: input.repository.project.links.self.href }]
                : [],
            },
          },
          public: !input.repository.is_private,
          links: {
            clone: [],
            self: input.pullrequest.destination.repository.links.self
              ? [
                  {
                    href: input.pullrequest.destination.repository.links.self
                      .href,
                  },
                ]
              : [],
          },
        },
      },
      locked: false,
      author: {
        user: {
          name:
            input.pullrequest.author.nickname ||
            input.pullrequest.author.display_name,
          emailAddress: "",
          id: parseInt(input.pullrequest.author.account_id, 16) || 0,
          displayName: input.pullrequest.author.display_name,
          active: true,
          slug:
            input.pullrequest.author.nickname ||
            input.pullrequest.author.display_name
              .toLowerCase()
              .replace(/\s+/g, "-"),
          type: input.pullrequest.author.type,
          links: {
            self: input.pullrequest.author.links.self
              ? [{ href: input.pullrequest.author.links.self.href }]
              : [],
          },
        },
        role: "AUTHOR",
        approved: false,
        status: input.pullrequest.state,
      },
      reviewers: input.pullrequest.reviewers.map((reviewer) => ({
        user: {
          name: reviewer.nickname || reviewer.display_name,
          emailAddress: "",
          id: parseInt(reviewer.account_id, 16) || 0,
          displayName: reviewer.display_name,
          active: true,
          slug:
            reviewer.nickname ||
            reviewer.display_name.toLowerCase().replace(/\s+/g, "-"),
          type: reviewer.type,
          links: {
            self: reviewer.links.self
              ? [{ href: reviewer.links.self.href }]
              : [],
          },
        },
        role: "REVIEWER",
        approved: false,
        status: "",
      })),
      participants: input.pullrequest.participants,
      links: {
        self: input.pullrequest.links.self
          ? [{ href: input.pullrequest.links.self.href }]
          : [],
      },
    },
  };
}

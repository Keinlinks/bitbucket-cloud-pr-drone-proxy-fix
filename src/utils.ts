import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import { WebhookBitbucketOnPremisePR } from "./models/WebhookBitbucketOnPremisePR";

export function transformBitbucketWebhookPRToOnPremisePR(
  input: WebhookBitbucketCloudPR
): WebhookBitbucketOnPremisePR {
  // Extraer el slug del repositorio desde full_name (e.g., "workspace/repo" -> "repo")
  const repoSlug =
    input.repository.full_name.split("/")[1] || input.repository.name;

  // Convertir fechas ISO a timestamps (milisegundos)
  const createdDate = new Date(input.pullrequest.created_on).getTime();
  const updatedDate = new Date(input.pullrequest.updated_on).getTime();

  return {
    eventKey: "pullrequest:created", // Valor predeterminado, ajustar según el evento
    date: input.pullrequest.created_on, // Mantener como cadena ISO
    actor: {
      name: input.actor.nickname || input.actor.display_name,
      emailAddress: "", // No disponible en BitbucketWebhookPR
      id: parseInt(input.actor.account_id, 16) || 0, // Convertir account_id a número
      displayName: input.actor.display_name,
      active: true, // Suposición
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
      version: 1, // No disponible en BitbucketWebhookPR, valor predeterminado
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
          description: "", // No disponible en Repository3
          scmId: input.pullrequest.source.repository.type,
          state: "AVAILABLE", // Suposición
          statusMessage: "Available", // Suposición
          forkable: true, // Suposición
          project: {
            key: input.repository.project.key, // Usar project desde el repositorio raíz
            id:
              parseInt(
                input.repository.project.uuid.replace(/[{}]/g, ""),
                16
              ) || 0,
            name: input.repository.project.name,
            description: "", // No disponible
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
            clone: [], // No disponible en Repository3
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
          description: "", // No disponible en Repository2
          scmId: input.pullrequest.destination.repository.type,
          state: "AVAILABLE", // Suposición
          statusMessage: "Available", // Suposición
          forkable: true, // Suposición
          project: {
            key: input.repository.project.key, // Usar project desde el repositorio raíz
            id:
              parseInt(
                input.repository.project.uuid.replace(/[{}]/g, ""),
                16
              ) || 0,
            name: input.repository.project.name,
            description: "", // No disponible
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
            clone: [], // No disponible en Repository2
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
      locked: false, // No disponible en BitbucketWebhookPR
      author: {
        user: {
          name:
            input.pullrequest.author.nickname ||
            input.pullrequest.author.display_name,
          emailAddress: "", // No disponible
          id: parseInt(input.pullrequest.author.account_id, 16) || 0,
          displayName: input.pullrequest.author.display_name,
          active: true, // Suposición
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
        approved: false, // No disponible
        status: input.pullrequest.state,
      },
      reviewers: input.pullrequest.reviewers.map((reviewer) => ({
        user: {
          name: reviewer.nickname || reviewer.display_name,
          emailAddress: "", // No disponible
          id: parseInt(reviewer.account_id, 16) || 0,
          displayName: reviewer.display_name,
          active: true, // Suposición
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
        approved: false, // No disponible
        status: "", // No disponible
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

const projectsRoute = [
  {
    path: "/projects",
    children: [
      {
        path: "/projects",
        redirect: "/projects",
        children: [
          {
            path: "/projects",
            name: "ProjectsList",
            component: () => import('@/views/projects/projectsList/index.vue'),
          },
          {
            path: "/projects/:id/details/:type",
            name: "ProjectsListDetails",
            component: () => import('@/views/projects/projectsListDetails/index.vue'),
          },
          {
            path: "/projects/integrated/:id",
            name: "ProjectsIntegrated",
            component: () => import('@/views/projects/projectsIntegrated/index.vue')
          }
        ],
      },
      {
        path: "/projects/create",
        name: "ProjectsCreat",
        component: () => import('@/views/projects/projectsCreat/index.vue'),
      },
      {
        path: "/projects/projectAddNew",
        name: "ProjectAddNew",
        component: () => import('@/views/projects/projectAddNew/index.vue'),
      },
      
      {
        path: "/projects/template/:type",
        redirect: "/projects/template/:type",
        children: [
          {
            path: "/projects/template/:type",
            name: "ProjectsTemplate",
            component: () => import('@/views/projects/projectsTemplate/index.vue'),
          },
          {
            path: "/projects/templates/:templateId/details/:type",
            name: "ProjectsTemplatesDetails",
            component: () => import('@/views/projects/projectsTemplatesDetails/index.vue'),
          },
          {
            path: "/projects/templates/:contractName/standard",
            name: "ProjectsStandardContract",
            component: () => import('@/views/projects/projectsStandardContract/index.vue'),
          },
          {
            path: "/projects/templates/details",
            name: "FilecoinDetail",
            component: () => import('@/views/projects/FilecoinDetail/index.vue'),
          },
        ]
      },
      {
        path: "/projects/:id/:workflowsId/workflows/:workflowDetailId/:type/:projectType",
        redirect: "/projects/:id/workflows/:workflowDetailId/:type/:projectType",
        children: [
          {
            path: "/projects/:id/:workflowsId/workflows/:workflowDetailId/:type/:projectType",
            name: "ProjectsWorkflows",
            component: () => import('@/views/projects/projectsWorkflows/index.vue'),
          },
          {
            path: "/projects/:workflowsId/workflows/:workflowDetailId/allLogs",
            name: "ProjectsWorkflowsAllLogs",
            component: () => import('@/views/projects/projectsWorkflowsAllLogs/index.vue'),
            meta: {
              layout: 'null',
            }
          },
          {
            path: "/projects/:id/:workflowsId/workflows/:workflowDetailId/:type/:projectType/:checktype",
            name: "ProjectsCheckReport",
            component: () => import('@/views/projects/projectsCheckReport/index.vue')
          }
        ],
      },
      {
        path: "/projects/:id/artifacts-contract/:version/deploy/:contract",
        name: "projectsArtifactsContractDeploy",
        component: () => import('@/views/projects/projectsArtifactsContractDeploy/index.vue'),
      },
      {
        path: "/projects/:id/contracts-details/:version",
        name: "ProjectsContractsDetails",
        component: () => import('@/views/projects/projectsContractsDetails/index.vue'),
      },
      {
        path: "/projects/:workflowsId/frontend-details/:workflowDetailId/:packageId",
        name: "projectsFrontendDetails",
        component: () => import('@/views/projects/projectsFrontendDetails/index.vue'),
      },
      {
        path: "/projects/projectsDeploymentOrchestration",
        name: "projectsDeploymentOrchestration",
        component: () => import('@/views/projects/projectsDeploymentOrchestration/index.vue'),
      },
      {
        path: '/projects/projectsDeploymentDetail',
        name: "projectsDeploymentDetail",
        component: () => import('@/views/projects/projectsDeploymentDetail/index.vue'),
      },
      {
        path: '/projects/projectsDashboard',
        name: "projectsDashboard",
        component: () => import('@/views/projects/projectsDashboard/index.vue'),
      },
      {
        path: '/projects/projectDashboardExplorer',
        name: "projectDashboardExplorer",
        component: () => import('@/views/projects/projectDashboardExplorer/index.vue'),
      },
      {
        path: '/projects/projectsDeploySeting',
        name: "projectsDeploySeting",
        component: () => import('@/views/projects/projectsDeploySeting/index.vue'),
      },
      {
        path: '/projects/installations',
        name: "projectsInstallations",
        component: () => import('@/views/projects/projectsCreat/installations.vue'),
        meta: {
          layout: 'null',
        }
      },
      {
        path: '/projects/adjustPremission',
        name: "projectsAdjustPremission",
        component: () => import('@/views/projects/projectsCreat/adjustPremission.vue'),
        meta: {
          layout: 'null',
        }
      },
      {
        path: '/projects/metaMaskAuth',
        name:'projectsMetaMaskAuth',
        component: () => import('@/views/projects/projectsCreat/metaMaskAuth.vue'),
        meta: {
          layout: 'null',
        }
      },
      {
        path: '/projects/connectGithub',
        name:'projectsConnectGithub',
        component: () => import('@/views/projects/projectsCreat/connectGithub.vue'),
        meta: {
          layout: 'null',
        }
      }
    ]
  }
]
export default projectsRoute
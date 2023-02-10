import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login/index.vue";
import LoginTransition from "../views/login/loginTransition.vue";
import HomeView from "../views/home/HomeView.vue";
import RpcsIndex from "../views/nodeService/rpcs/index.vue";
import AppsIndex from "../views/nodeService/apps/index.vue";
import ProjectsList from "../views/projects/projectsList/index.vue";
import ProjectsListDetails from "../views/projects/projectsListDetails/index.vue";
import ProjectsCreat from "../views/projects/projectsCreat/index.vue";
import ProjectsTemplate from "../views/projects/projectsTemplate/index.vue";
import ProjectsTemplatesDetails from "../views/projects/projectsTemplatesDetails/index.vue";
import ProjectsWorkflows from "../views/projects/projectsWorkflows/index.vue";
import ProjectsWorkflowsAllLogs from "../views/projects/projectsWorkflowsAllLogs/index.vue";
import projectsArtifactsContractDeploy from "../views/projects/projectsArtifactsContractDeploy/index.vue";
import ProjectsContractsDetails from "../views/projects/projectsContractsDetails/index.vue";
import ProjectsStandardContract from "../views/projects/projectsStandardContract/index.vue";
import ProjectsFrontendDetails from "../views/projects/projectsFrontendDetails/index.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    // {
    //   path: "/",
    //   redirect: "/RPCs",
    // },
    // {
    //   path: "/RPCs",
    //   name: "RPCs",
    //   component: RpcsIndex,
    // },
    // {
    //   path: "/Apps",
    //   name: "AppsIndex",
    //   component: AppsIndex,
    // },
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'Login',
          component: Login,
        }
      ],
      meta: {
        layout: 'null',
      }
    },
    {
      path: '/loginTransition',
      name: 'LoginTransition',
      component: LoginTransition,
      meta: {
        layout: 'null',
      }
    },
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
              component: ProjectsList,
            },
            {
              path: "/projects/:id/details/:type",
              name: "ProjectsListDetails",
              component: ProjectsListDetails,
            }
          ],
        },
        {
          path: "/projects/create",
          name: "ProjectsCreat",
          component: ProjectsCreat,
        },
        {
          path: "/projects/template/:type",
          redirect: "/projects/template/:type",
          children: [
            {
              path: "/projects/template/:type",
              name: "ProjectsTemplate",
              component: ProjectsTemplate,
            },
            {
              path: "/projects/templates/:templateId/details/:type",
              name: "ProjectsTemplatesDetails",
              component: ProjectsTemplatesDetails,
            },
            {
              path: "/projects/templates/:contractName/standard",
              name: "ProjectsStandardContract",
              component: ProjectsStandardContract,
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
              component: ProjectsWorkflows,
            },
            {
              path: "/projects/:workflowsId/workflows/:workflowDetailId/allLogs",
              name: "ProjectsWorkflowsAllLogs",
              component: ProjectsWorkflowsAllLogs,
              meta: {
                layout: 'null',
              }
            }
          ],
        },
        {
          path: "/projects/:id/artifacts-contract/:version/deploy/:contract",
          name: "projectsArtifactsContractDeploy",
          component: projectsArtifactsContractDeploy,
        },
        {
          path: "/projects/:id/contracts-details/:version",
          name: "ProjectsContractsDetails",
          component: ProjectsContractsDetails,
        },
        {
          path: "/projects/:workflowsId/frontend-details/:workflowDetailId/:packageId",
          name: "projectsFrontendDetails",
          component: ProjectsFrontendDetails,
        }
      ]
    },
    {
      path: "/node-service",
      redirect: "/node-service/RPCs",
      children: [
        {
          path: "/node-service/RPCs",
          name: "RPCs",
          component: RpcsIndex,
        },
        {
          path: "/node-service/Apps",
          name: "AppsIndex",
          component: AppsIndex,
        }
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const token = localStorage.getItem('token') || '';
  if (!token) {
    if (to.path !== '/login' && to.path !== '/loginTransition') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;

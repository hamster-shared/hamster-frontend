// src/mock/json/marketplaceList.json
var marketplaceList_default = [
  {
    id: "1",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  },
  {
    id: "2",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  },
  {
    id: "3",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  }
];

// src/mock/agent.ts
var agent_default = [
  {
    url: "/mock/getMarketplaceList",
    method: "get",
    response: ({ query }) => {
      return {
        code: 200,
        data: marketplaceList_default,
        message: "success"
      };
    }
  }
];
export {
  agent_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svYWdlbnQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRDpcXFxcTmV3dG91Y2hcXFxccHJvamVjdFxcXFxoYW1zdGVyLWZyb250ZW5kXFxcXHNyY1xcXFxtb2NrXFxcXGFnZW50LnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkQ6XFxcXE5ld3RvdWNoXFxcXHByb2plY3RcXFxcaGFtc3Rlci1mcm9udGVuZFxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRDovTmV3dG91Y2gvcHJvamVjdC9oYW1zdGVyLWZyb250ZW5kL3NyYy9tb2NrL2FnZW50LnRzXCI7aW1wb3J0IHR5cGUgeyBNb2NrTWV0aG9kIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbmltcG9ydCBtYXJrZXRwbGFjZUxpc3QgZnJvbSAnLi9qc29uL21hcmtldHBsYWNlTGlzdC5qc29uJ1xuZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgdXJsOiAnL21vY2svZ2V0TWFya2V0cGxhY2VMaXN0JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgIGRhdGE6IG1hcmtldHBsYWNlTGlzdCxcbiAgICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3MnXG4gICAgICB9XG4gICAgfSxcbiAgfVxuXSBhcyBNb2NrTWV0aG9kW11cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTyxnQkFBUTtBQUFBLEVBQ2I7QUFBQSxJQUNFLEtBQUs7QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFVBQVUsQ0FBQyxFQUFFLE1BQU0sTUFBTTtBQUN2QixhQUFPO0FBQUEsUUFDTCxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==

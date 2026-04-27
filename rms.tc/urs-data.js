/* ============================================================
   RMS · URS (User Requirement Specification) Index Data
   35 screens × 1 URS page each
   ============================================================ */

const URS_LIST = [
  // SYS — System & Auth (3)
  { id: "URS_SYS_LGN", area: "SYS", screen: "Login",               title: "로그인 · 인증",                 hasDetail: false },
  { id: "URS_SYS_SVR", area: "SYS", screen: "Server Setup",        title: "서버 연결 설정",                hasDetail: false },
  { id: "URS_SYS_PND", area: "SYS", screen: "Pending Recipes",     title: "Pending Recipes 알림",          hasDetail: false },

  // DSH — Dashboard (3)
  { id: "URS_DSH_RMS", area: "DSH", screen: "RMS Dashboard",       title: "RMS 시스템 대시보드",           hasDetail: false },
  { id: "URS_DSH_EQP", area: "DSH", screen: "Equipment Dashboard", title: "장비 운영 대시보드",            hasDetail: false },
  { id: "URS_DSH_RCP", area: "DSH", screen: "Recipe Dashboard",    title: "Recipe 운영 대시보드",          hasDetail: false },

  // EQP — Equipment (3)
  { id: "URS_EQP_MGR", area: "EQP", screen: "Equipment Manager",   title: "장비 조회 · 관리",              hasDetail: false },
  { id: "URS_EQP_REG", area: "EQP", screen: "Equipment Registration", title: "장비 등록",                 hasDetail: false },
  { id: "URS_EQP_GRP", area: "EQP", screen: "Manage Equipment Groups", title: "장비 그룹 관리",            hasDetail: false },

  // RCP — Recipe (8)
  { id: "URS_RCP_MGR", area: "RCP", screen: "Recipe Manager",      title: "Recipe 조회 · 관리",            hasDetail: true },
  { id: "URS_RCP_CMP", area: "RCP", screen: "Compare Recipes",     title: "Recipe 비교",                   hasDetail: false },
  { id: "URS_RCP_DEP", area: "RCP", screen: "Deploy Recipes",      title: "Recipe 배포",                   hasDetail: true  },
  { id: "URS_RCP_XML", area: "RCP", screen: "Deploy Custom XML",   title: "Custom XML 배포",               hasDetail: true },
  { id: "URS_RCP_VER", area: "RCP", screen: "Manage Recipe Versions", title: "Recipe 버전 관리",           hasDetail: false },
  { id: "URS_RCP_PRM", area: "RCP", screen: "Manage Recipe Parameters", title: "파라미터 표시 설정",       hasDetail: false },
  { id: "URS_RCP_GRP", area: "RCP", screen: "Manage Recipe Groups", title: "Recipe 그룹 관리",             hasDetail: false },
  { id: "URS_RCP_DIR", area: "RCP", screen: "Direct Upload/Download", title: "Recipe 직접 업·다운로드",    hasDetail: false },

  // MTD — Method (6)
  { id: "URS_MTD_MGR", area: "MTD", screen: "Method Manager",      title: "Method 조회 · 관리",            hasDetail: false },
  { id: "URS_MTD_CMP", area: "MTD", screen: "Compare Methods",     title: "Method 비교",                   hasDetail: false },
  { id: "URS_MTD_DEP", area: "MTD", screen: "Deploy Methods",      title: "Method 배포",                   hasDetail: false },
  { id: "URS_MTD_VER", area: "MTD", screen: "Manage Method Versions", title: "Method 버전 관리",           hasDetail: false },
  { id: "URS_MTD_GRP", area: "MTD", screen: "Manage Method Groups", title: "Method 그룹 관리",             hasDetail: false },
  { id: "URS_MTD_DIR", area: "MTD", screen: "Direct Upload/Download Methods", title: "Method 직접 업·다운로드", hasDetail: false },

  // CLT — Collect (2)
  { id: "URS_CLT_RCP", area: "CLT", screen: "Collect Recipes",     title: "Recipe 자동 수집",              hasDetail: false },
  { id: "URS_CLT_MTD", area: "CLT", screen: "Collect Methods",     title: "Method 자동 수집",              hasDetail: false },

  // HST — History & Log (6)
  { id: "URS_HST_EQP", area: "HST", screen: "Equipment History",   title: "장비 이력",                     hasDetail: false },
  { id: "URS_HST_RCP", area: "HST", screen: "Recipe History",      title: "Recipe 이력",                   hasDetail: false },
  { id: "URS_HST_MTD", area: "HST", screen: "Method History",      title: "Method 이력",                   hasDetail: false },
  { id: "URS_HST_RMS", area: "HST", screen: "RMS Log",             title: "사용자 · 감사 로그",            hasDetail: false },
  { id: "URS_HST_SVR", area: "HST", screen: "Server Log",          title: "서버 시스템 로그",              hasDetail: false },
  { id: "URS_HST_DEP", area: "HST", screen: "Deployment Log",      title: "배포 이력",                     hasDetail: false },

  // SET — Settings (4)
  { id: "URS_SET_PRF", area: "SET", screen: "Preference",          title: "개인 설정",                     hasDetail: false },
  { id: "URS_SET_CNN", area: "SET", screen: "Connection",          title: "연결 관리",                     hasDetail: false },
  { id: "URS_SET_PRV", area: "SET", screen: "Privilege",           title: "권한 관리",                     hasDetail: false },
  { id: "URS_SET_ACC", area: "SET", screen: "Account",             title: "계정 관리",                     hasDetail: false },
];

const URS_AREA_NAMES = {
  SYS: "System & Auth",
  DSH: "Dashboard",
  EQP: "Equipment",
  RCP: "Recipe",
  MTD: "Method",
  CLT: "Collect",
  HST: "History & Log",
  SET: "Settings",
};

const URS_AREA_ORDER = ["SYS", "DSH", "EQP", "RCP", "MTD", "CLT", "HST", "SET"];

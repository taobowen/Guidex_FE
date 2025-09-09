type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    '/page/video': undefined;
    '/page/records': undefined;
    '/page/records/:id': undefined; // For individual record details
    '/page/records/:id/edit': undefined; // For editing a record
    '/page/profile': undefined;
    '/page/profile/edit': undefined;
    '/page/evaluation': undefined;
    '/page/suggestion': undefined;

    '/auth/signUp': undefined;
    '/auth/signIn': undefined;

    'welcome': undefined;

    // Add other routes here as needed
};

// const CATEGORY = {
//   SNOWBOARD: 0,
//   SKI: 1,
// }
// // 0-General,1-AASI,2-BASI,3-CASI
// const STANDARD = {
//   GENERAL: 0,
//   AASI: 1,
//   BASI: 2,
//   CASI: 3,
//   CISA: 4, // Ski specific
// };
// // type: 0-Flow,1-Carving

// const TYPE = {
//   FLOW: 0,
//   CARVING: 1,
// };

type CATEGORY = CATEGORY;

type STANDARD = STANDARD;

type TYPE = TYPE;

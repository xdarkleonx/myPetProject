module.exports = {
  presets: ['module:metro-react-native-babel-preset']
};

// export default function override(api) {
//   var env = api.cache(() => process.env.NODE_ENV);
//   var isProd = api.cache(() => process.env.NODE_ENV === "production");
//   var config;
//   if (isProd) {
//     config = {
//       plugins: ["transform-remove-console"],
//       presets: ["module:metro-react-native-babel-preset"]
//     }
//   } else {
//     config = { presets: ["module:metro-react-native-babel-preset"] }
//   }

//   return config;
// };
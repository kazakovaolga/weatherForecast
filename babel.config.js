// module.exports = {
//     presets: [["@babel/preset-env", { targets: { node: "current" } }]],
//   };

module.exports = api => {
    return {
        plugins: [
            "@babel/plugin-proposal-nullish-coalescing-operator",
            "@babel/plugin-proposal-optional-chaining"
        ],
        presets: [
            [
                "@babel/preset-env",
                {
                    useBuiltIns: "entry",                    
                    targets: api.caller(caller => caller && caller.target === "node")
                        ? { node: "current" }
                        : { chrome: "58", ie: "11" }
                }
            ]
        ]
    }
}
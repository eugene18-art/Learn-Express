const config={
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
    },
    default: {
        // generate it using require('crypto').randomBytes(64).toString('hex')
        SECRET: 'ec509e581be1313144c46c5f06838f9ae786eba5098cc450a70fe2a16d48cb2777de7cdb7efec3bc405129a32a6d4a060fb8384a172f2fc82fdc839375b0de70',
        DATABASE: 'mongodb://localhost:27017/Users'
    }
}

exports.get = function get(env){
    return config[env] || config.default;
}
module.exports = ({ UserService }) => ({
    registerUser: UserService.registerUser,
    generateLoginTokens: UserService.generateLoginTokens,
    refreshToken: async (refreshToken) => {
        return await UserService.refreshAccessToken(refreshToken);
    },
});

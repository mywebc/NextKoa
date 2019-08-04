const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = "Iv1.0a38a06b9ed3b948"
module.exports = {
    github: {
        client_id,
        client_sercet: "3b558d58210340db44b507991332a04123feaefe"
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`,
}
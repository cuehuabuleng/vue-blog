const github_config = {
    client_id: "b1664838af4f50ecae3e",
    scope:'user,repo',
    login:true
}
const github_oauth_url = 'https://github.com/login/oauth/authorize'
const oauth_url = `${github_oauth_url}?client_id=${github_config.client_id}&scope=${github_config.scope}&login=${github_config.login}`
module.exports = {
    oauth_url
}
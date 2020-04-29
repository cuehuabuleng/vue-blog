const { ErroModal } = require('../modle/resModel');

module.exports = async (ctx, next) => {
    if (ctx.session.user) {
        await next();
        return;
    } else if (ctx.session.github_user) {
        await next();
        return;
    }
    ctx.body = new ErroModal('尚未登录')
}
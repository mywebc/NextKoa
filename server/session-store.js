function getSessionId(id) {
    // 设置好前缀
    return `ssid:${id}`
}

class RedisSessionStore {
    constructor(client) {
        this.client = client
    }
    async get(id) {
        const id = getSessionId(id)
        const data = await this.client.get(id)
        if (!data) {
            return null
        }
        try {
            return JSON.parse(data)
        } catch (error) {
            console.log(error)
        }
    }
    async set(id, sess, ttl) {
        const id = getRedisSessionId(id)
        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000)
        }
        try {
            const sessStr = JSON.stringify(sess)
            if (ttl) {
                await this.client.setex(id, ttl, sessStr)
            } else {
                await this.client.set(id, sessStr)
            }
        } catch (err) {
            console.error(err)
        }

    }
    async destroy(id) {
        const id = getRedisSessionId(id)
        await this.client.del(id)
    }
}
module.exports = RedisSessionStore
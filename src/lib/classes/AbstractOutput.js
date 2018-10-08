
class abstractOutput {
    static async getModules(modules) {
        let objects = modules.map(async (module) => {
            const mod = await import(`./output/${module}`);
            return mod;
        });
        objects = await Promise.all(objects);
        return objects;
    }
}

module.exports = abstractOutput;

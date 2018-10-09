
class TargetFactory {
    #modules = [];
    #data = {};

    async loadTargets(modules) {
        const objects = modules.map(async (module) => {
            const mod = await import(`./target/${module}`);
            return mod;
        });
        const mods = await Promise.all(objects);
        this.targets = mods.map((module) => new module.default());
        this.validateTargets();
        return this.modules;
    }

    validateTargets() {
        try {
            this.targets.map((module) => {
                module.validateSettings();
            });
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    async syncTargets() {
        let resolved = this.#modules.map(async (module) => {
            const result = await module.sync();
            return result;
        });
        resolved = Promise.all(resolved);
        return resolved;
    }

    get powerData() {
        return this.#data;
    }

    set powerData(data) {
        this.#data = data;
        this.#modules.forEach((module) => {
            module.powerData = data;
        });
    }

    get targets() {
        return this.#modules;
    }

    set targets(targetArray = []) {
        this.#modules = targetArray;
    }
}

export default TargetFactory;
